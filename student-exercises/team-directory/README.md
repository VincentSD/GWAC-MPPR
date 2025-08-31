# 👥 Research Team Directory

Welcome to the G-WAC Short Course collaborative Git exercise! This simple exercise will teach you the fundamentals of collaborative development through hands-on practice with merge conflicts, pull requests, and team coordination.

## 🎯 Exercise Goal

Each team member will add their information to this README file, creating intentional merge conflicts that you'll learn to resolve together. By the end, you'll have mastered the essential Git collaboration skills used by research teams worldwide.

## 📋 Team Members

*Add your information below using the provided format. Don't worry about conflicts - they're part of the learning process!*

<!-- 
Each team member should add their info in this format:

### [Your Name]
- **Role:** [Research interest/specialty]
- **Institution:** [Your university/organization]  
- **Fun Fact:** [Something interesting about you]
- **Git Status:** Learning collaborative workflows! 🚀

Example:
### Dr. Sarah Chen
- **Role:** Disease modeling specialist
- **Institution:** University of Global Health
- **Fun Fact:** I've modeled outbreaks on 4 continents
- **Git Status:** Learning collaborative workflows! 🚀
-->

### Course Instructor
- **Role:** Git & GitHub workflow facilitator
- **Institution:** G-WAC Research Network
- **Fun Fact:** Has resolved over 1,000 merge conflicts!
- **Git Status:** Ready to guide your collaboration journey! 🎓

---

## 🔄 Workflow Instructions

1. **Fork this repository** to your GitHub account
2. **Clone your fork** locally: `git clone https://github.com/[your-username]/GWAC-MPPR.git`
3. **Navigate to this directory**: `cd GWAC-MPPR/student-exercises/team-directory`
4. **Create your branch**: `git checkout -b add-[your-name]`
5. **Edit this README** to add your information in the Team Members section above
6. **Commit your changes**: `git add README.md && git commit -m "Add [Your Name] to team directory"`
7. **Push to your fork**: `git push origin add-[your-name]`
8. **Create a Pull Request** back to the original repository
9. **Handle merge conflicts** when they arise (they will!)
10. **Review teammates' PRs** and provide constructive feedback

## ⚔️ Handling Merge Conflicts

When conflicts occur (and they will!), follow these steps:

1. **Fetch the latest changes**: `git fetch upstream`
2. **Merge the main branch**: `git merge upstream/main`
3. **Open the README file** in your editor - look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> upstream/main
   ```
4. **Resolve the conflict** by keeping both sets of information (everyone should be included!)
5. **Remove the conflict markers** and ensure proper formatting
6. **Commit the resolution**: `git add README.md && git commit -m "Resolve merge conflict"`
7. **Push the updated branch**: `git push origin add-[your-name]`

## 🎉 Success Criteria

Your team has successfully completed the exercise when:

- ✅ All team members appear in the Team Members section
- ✅ Each person created their own branch and PR  
- ✅ Merge conflicts were encountered and resolved
- ✅ Team members reviewed and commented on each other's PRs
- ✅ The final README is clean, well-formatted, and complete
- ✅ Everyone understands the collaborative Git workflow

## 💡 Pro Tips

- **Communicate!** Use PR comments and discussions to coordinate
- **Small commits** make conflicts easier to resolve
- **Descriptive commit messages** help teammates understand your changes
- **Review first** - look at open PRs before creating your own
- **Don't panic** when conflicts happen - they're normal and valuable learning opportunities!

## 🚀 Next Steps

After mastering this exercise, you'll be ready to:
- Collaborate on real research projects
- Contribute to open-source software
- Manage complex multi-person repositories
- Handle advanced Git workflows and branching strategies

**Ready to start? Fork this repository and let the collaboration begin!** 🎯
