# 🎓 G-WAC Summer School 2025 - Modern Website

## 🌟 **Overview**

This is a **modern, engaging summer school website** inspired by professional conference websites like [ICI3D MMED](https://www.ici3d.org/MMED/schedule/2023/), designed specifically for the G-WAC Mathematical Modeling & Public Health Research program.

## 🚀 **Key Features**

### **1. Conference-Style Schedule** 📅
- **Interactive Timeline**: Beautiful week-by-week schedule navigation
- **Session Details**: Comprehensive information for each day including:
  - Session times and descriptions
  - Instructor names and room assignments
  - Morning/afternoon session categorization
  - Theme-based day organization

### **2. Student Portal** 👨‍🎓
- **Progress Tracking**: Real-time completion status for all modules
- **Interactive Dashboard**: Visual progress indicators and statistics
- **Course Materials**: Easy access to all labs and resources
- **Personalized Experience**: Individual progress saved locally

### **3. Course Modules** 📚
- **5 Core Modules**: Mathematical Foundations, Epidemiological Modeling, Computational Methods, Data Analysis, Collaborative Research
- **Lab Integration**: Direct links to existing lab materials
- **Status Management**: Track completion of individual labs and modules
- **Expandable Cards**: Click to view detailed module information

### **4. Modern Design** 🎨
- **Responsive Layout**: Works perfectly on all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Professional Branding**: Consistent with G-WAC institutional identity
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🏗️ **Website Structure**

### **Main Pages**
1. **`index.html`** - Homepage with hero section, schedule, and overview
2. **`courses.html`** - Course materials hub with module management
3. **Lab Pages** - Existing lab content integrated into the new system

### **New CSS Files**
- **`css/summer-school.css`** - Main summer school styling
- **Enhanced existing CSS** - Updated components and responsive design

### **New JavaScript Files**
- **`js/summer-school.js`** - Main summer school functionality
- **`js/course-materials.js`** - Course management and progress tracking

## 📱 **Responsive Design**

The website is fully responsive and optimized for:
- **Desktop** (1200px+): Full layout with side-by-side content
- **Tablet** (768px-1199px): Adjusted grid layouts
- **Mobile** (<768px): Stacked layouts with mobile-friendly navigation

## 🎯 **How to Use**

### **For Students**
1. **View Schedule**: Navigate to the schedule section to see the full 2-week program
2. **Access Courses**: Go to the Courses page to browse all modules
3. **Track Progress**: Your progress is automatically saved as you complete labs
4. **Navigate Labs**: Click on lab links to access specific course materials

### **For Instructors**
1. **Update Schedule**: Modify the schedule section in `index.html`
2. **Add Modules**: Extend the modules array in `js/course-materials.js`
3. **Customize Content**: Update course descriptions and learning objectives
4. **Manage Resources**: Add or modify downloadable materials

### **For Administrators**
1. **Student Management**: The system automatically tracks student progress
2. **Content Updates**: Easy to modify course structure and materials
3. **Analytics**: Progress data can be exported for analysis
4. **Customization**: Branding and institutional information can be updated

## 🔧 **Technical Implementation**

### **Progress Tracking System**
- **Local Storage**: Student progress saved in browser
- **Real-time Updates**: Progress bars and status indicators update automatically
- **Data Export**: Progress can be exported as JSON for analysis

### **Interactive Features**
- **Schedule Navigation**: Week 1/Week 2 toggle with smooth transitions
- **Module Expansion**: Clickable module cards with detailed information
- **Lab Integration**: Seamless connection to existing lab materials
- **Form Handling**: Contact form with validation and notifications

### **Performance Optimizations**
- **Lazy Loading**: CSS and JavaScript loaded efficiently
- **Responsive Images**: Optimized for different screen sizes
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Memory Management**: Efficient event handling and cleanup

## 📊 **Data Integration**

### **Excel Integration** (Future Enhancement)
The system is designed to integrate with your student Excel file:
- **Student Count**: Currently shows 52 students (from your Excel data)
- **Progress Tracking**: Can be extended to sync with external databases
- **Data Export**: Progress data can be exported for administrative use

### **Word Document Integration**
Your course outline document can be:
- **Converted to HTML**: For better web presentation
- **Linked as Downloads**: Available in the resources section
- **Integrated into Schedule**: Course content mapped to schedule items

## 🚀 **Deployment**

### **GitHub Pages** (Recommended)
1. **Push to Repository**: All files are ready for GitHub Pages
2. **Automatic Updates**: Changes push automatically to live site
3. **Custom Domain**: Can be configured with your institutional domain
4. **HTTPS**: Automatic SSL certificate from GitHub

### **Traditional Web Hosting**
1. **Upload Files**: All static files ready for any web server
2. **No Server Requirements**: Pure HTML/CSS/JavaScript
3. **CDN Ready**: Can be served from content delivery networks
4. **Scalable**: Handles any number of concurrent users

## 🔮 **Future Enhancements**

### **Phase 2 Features**
- **User Authentication**: Individual student accounts
- **Real-time Collaboration**: Live progress sharing between students
- **Advanced Analytics**: Detailed completion statistics and insights
- **Mobile App**: Native mobile application for course access

### **Phase 3 Features**
- **AI Integration**: Personalized learning recommendations
- **Video Integration**: Embedded video content and lectures
- **Discussion Forums**: Student and instructor interaction
- **Assessment Tools**: Built-in quizzes and assignments

## 📝 **Customization Guide**

### **Branding Updates**
1. **Logo**: Replace `images/g-wac-logo.jpeg` and `images/g-wac-logo.png`
2. **Colors**: Modify CSS variables in `css/summer-school.css`
3. **Typography**: Update font imports and CSS font families
4. **Content**: Edit text content in HTML files

### **Schedule Modifications**
1. **Dates**: Update dates in `index.html` schedule section
2. **Sessions**: Modify session content, times, and instructors
3. **Themes**: Change daily themes and session descriptions
4. **Structure**: Add or remove days as needed

### **Module Management**
1. **Add Modules**: Extend the modules object in `js/course-materials.js`
2. **Lab Integration**: Connect new labs to existing lab files
3. **Content**: Update module descriptions and learning objectives
4. **Resources**: Add new downloadable materials and links

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Progress Not Saving**: Check browser localStorage support
2. **Styling Issues**: Ensure all CSS files are loaded correctly
3. **JavaScript Errors**: Check browser console for error messages
4. **Mobile Issues**: Test responsive design on various devices

### **Debug Mode**
- **Console Logging**: Detailed logging for development
- **Error Handling**: Comprehensive error catching and reporting
- **Performance Monitoring**: Built-in performance tracking
- **Data Validation**: Input validation and error messages

## 📚 **Documentation & Support**

### **Code Comments**
- **Comprehensive Documentation**: All functions and methods documented
- **Inline Comments**: Clear explanations throughout the code
- **API Reference**: Detailed function documentation
- **Examples**: Usage examples and best practices

### **Support Resources**
- **GitHub Issues**: Report bugs and request features
- **Documentation**: This README and inline code comments
- **Community**: Connect with other users and developers
- **Updates**: Regular improvements and feature additions

## 🎉 **Success Metrics**

### **User Experience**
- **Engagement**: Interactive elements increase user interaction
- **Navigation**: Intuitive design reduces learning curve
- **Accessibility**: Inclusive design for all users
- **Performance**: Fast loading and smooth interactions

### **Administrative Benefits**
- **Progress Tracking**: Real-time student progress monitoring
- **Content Management**: Easy updates and modifications
- **Data Export**: Comprehensive progress reporting
- **Scalability**: Handles growing student populations

## 🔗 **External References**

- **ICI3D MMED**: [https://www.ici3d.org/MMED/schedule/2023/](https://www.ici3d.org/MMED/schedule/2023/)
- **GitHub Pages**: [https://pages.github.com/](https://pages.github.com/)
- **Font Awesome**: [https://fontawesome.com/](https://fontawesome.com/)
- **Google Fonts**: [https://fonts.google.com/](https://fonts.google.com/)

---

**🎓 G-WAC Summer School 2025 - Transforming Mathematical Modeling Education Through Modern Technology**

*Built with ❤️ for the G-WAC community*
