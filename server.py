#!/usr/bin/env python3
"""
G-WAC File Management Server
Handles file uploads and serves files from the project directory
"""

import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
    'txt', 'r', 'py', 'js', 'html', 'css', 'json',
    'png', 'jpg', 'jpeg', 'gif', 'svg'
}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_info(filepath):
    """Get file information for metadata"""
    stat = os.stat(filepath)
    return {
        'size': stat.st_size,
        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
    }

@app.route('/')
def index():
    """Serve the main page"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>G-WAC File Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .status { padding: 20px; background: #e8f5e8; border-radius: 8px; }
            .endpoints { margin-top: 20px; }
            .endpoint { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>G-WAC File Management Server</h1>
        <div class="status">
            <h3>✅ Server Running Successfully!</h3>
            <p>Upload folder: <code>uploads/</code></p>
            <p>Files are being saved to your project directory</p>
        </div>
        <div class="endpoints">
            <h3>Available Endpoints:</h3>
            <div class="endpoint">
                <strong>POST /upload</strong> - Upload a file
            </div>
            <div class="endpoint">
                <strong>GET /files</strong> - List all files
            </div>
            <div class="endpoint">
                <strong>GET /files/&lt;filename&gt;</strong> - Download a file
            </div>
            <div class="endpoint">
                <strong>DELETE /files/&lt;filename&gt;</strong> - Delete a file
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Generate unique filename
            filename = secure_filename(file.filename)
            base_name, ext = os.path.splitext(filename)
            unique_filename = f"{base_name}_{uuid.uuid4().hex[:8]}{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            # Save file
            file.save(filepath)
            
            # Get file metadata
            file_info = get_file_info(filepath)
            
            # Create metadata record
            metadata = {
                'id': str(uuid.uuid4()),
                'name': filename,
                'filename': unique_filename,
                'title': request.form.get('title', filename),
                'description': request.form.get('description', ''),
                'category': request.form.get('category', 'General'),
                'session': request.form.get('session', ''),
                'size': file_info['size'],
                'type': file.content_type or 'application/octet-stream',
                'uploadDate': datetime.now().isoformat(),
                'uploadedBy': request.form.get('uploadedBy', 'Facilitator'),
                'downloadCount': 0
            }
            
            # Save metadata to JSON file
            metadata_file = os.path.join(UPLOAD_FOLDER, 'metadata.json')
            if os.path.exists(metadata_file):
                with open(metadata_file, 'r') as f:
                    all_metadata = json.load(f)
            else:
                all_metadata = []
            
            all_metadata.append(metadata)
            
            with open(metadata_file, 'w') as f:
                json.dump(all_metadata, f, indent=2)
            
            return jsonify({
                'success': True,
                'message': 'File uploaded successfully',
                'file': metadata
            })
        
        return jsonify({'error': 'File type not allowed'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files', methods=['GET'])
def list_files():
    """List all uploaded files"""
    try:
        metadata_file = os.path.join(UPLOAD_FOLDER, 'metadata.json')
        if not os.path.exists(metadata_file):
            return jsonify([])
        
        with open(metadata_file, 'r') as f:
            metadata = json.load(f)
        
        return jsonify(metadata)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files/<filename>', methods=['GET'])
def download_file(filename):
    """Download a specific file"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a specific file"""
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            
            # Remove from metadata
            metadata_file = os.path.join(UPLOAD_FOLDER, 'metadata.json')
            if os.path.exists(metadata_file):
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
                
                metadata = [m for m in metadata if m['filename'] != filename]
                
                with open(metadata_file, 'w') as f:
                    json.dump(metadata, f, indent=2)
            
            return jsonify({'success': True, 'message': 'File deleted successfully'})
        else:
            return jsonify({'error': 'File not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/view/<filename>')
def view_file(filename):
    """View a file in the browser (for PDFs, images, etc.)"""
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting G-WAC File Management Server...")
    print(f"📁 Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📤 Upload endpoint: http://localhost:5000/upload")
    print("📋 Files endpoint: http://localhost:5000/files")
    print("\n💡 To stop the server, press Ctrl+C")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
