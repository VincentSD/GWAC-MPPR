# G-WAC File Management with Git Integration

## 🎯 **Perfect for GitHub Pages Hosting!**

This system saves files directly to your GitHub repository, making it ideal for GitHub Pages hosting.

## 🚀 **How It Works**

1. **Files are uploaded directly to your GitHub repository**
2. **Automatic Git commits** for every file upload
3. **Version control** for all course materials
4. **Collaborative access** for team members
5. **Permanent storage** in your repository

## 🔑 **Setup Instructions**

### 1. **Create GitHub Personal Access Token**

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "G-WAC File Manager"
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 2. **Configure Repository Structure**

The system will automatically create this folder structure in your repository:

```
course-materials/
├── R Programming/
├── Disease Modeling/
├── Presentations/
├── Exercises/
├── Data & Datasets/
└── Documentation/
```

### 3. **Use the File Manager**

1. **Enter your GitHub token** in the input field
2. **Upload files** using drag & drop or the upload button
3. **Files are automatically committed** to your repository
4. **Access files** via direct download or GitHub viewing

## 📁 **File Organization**

- **Automatic categorization** by file type and session
- **Timestamped filenames** to prevent conflicts
- **Metadata storage** for easy searching and filtering
- **Session linking** to connect materials with course content

## 🔧 **Technical Details**

### **GitHub API Integration**
- Uses GitHub's Git Data API
- Creates blobs, trees, and commits automatically
- Updates branch references
- Handles file conflicts gracefully

### **File Types Supported**
- **Documents**: PDF, Word, PowerPoint, Excel
- **Code**: R, Python, JavaScript, HTML, CSS
- **Images**: PNG, JPG, GIF, SVG
- **Data**: CSV, JSON, TXT

### **Security Features**
- **Token-based authentication**
- **Secure file uploads**
- **No server-side storage needed**
- **Direct GitHub integration**

## 🌐 **GitHub Pages Compatibility**

✅ **Works perfectly with GitHub Pages**
✅ **No server setup required**
✅ **Files accessible via raw GitHub URLs**
✅ **Automatic deployment on push**

## 📱 **Features**

### **For Facilitators**
- **Drag & drop file uploads**
- **Automatic categorization**
- **Session linking**
- **Metadata management**

### **For Students**
- **Search and filter files**
- **Direct downloads**
- **GitHub viewing**
- **Session-based organization**

## 🚨 **Important Notes**

1. **Keep your token secure** - don't share it publicly
2. **Repository permissions** - ensure the token has write access
3. **File size limits** - GitHub has 100MB file size limits
4. **Rate limiting** - GitHub API has rate limits for large uploads

## 🔄 **Updating Files**

- **New uploads** create new commits
- **File history** is preserved in Git
- **Rollback capability** to previous versions
- **Collaborative editing** through Git

## 📊 **Benefits Over Server-Based Solutions**

| Feature | Git Integration | Server-Based |
|---------|----------------|--------------|
| **Hosting** | ✅ GitHub Pages | ❌ Server needed |
| **Storage** | ✅ Repository | ❌ External storage |
| **Version Control** | ✅ Git history | ❌ Manual backup |
| **Collaboration** | ✅ Team access | ❌ User management |
| **Cost** | ✅ Free | ❌ Hosting fees |
| **Maintenance** | ✅ Zero | ❌ Server maintenance |

## 🎉 **Getting Started**

1. **Get your GitHub token** (see Setup Instructions)
2. **Enter the token** in the file manager
3. **Start uploading** course materials
4. **Files are automatically saved** to your repository
5. **Share the repository** with your team

## 🆘 **Troubleshooting**

### **Token Issues**
- Ensure token has `repo` scope
- Check repository permissions
- Verify token hasn't expired

### **Upload Failures**
- Check file size (max 100MB)
- Verify file type is supported
- Ensure repository exists and is accessible

### **GitHub API Limits**
- Rate limits: 5,000 requests/hour for authenticated users
- File size: 100MB maximum per file
- Repository size: 1GB recommended maximum

## 📞 **Support**

For issues or questions:
1. Check GitHub API status
2. Verify token permissions
3. Review repository settings
4. Check browser console for errors

---

**🎯 This Git integration provides the perfect solution for GitHub Pages hosting while maintaining all the benefits of version control and collaboration!**
