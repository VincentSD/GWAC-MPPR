#!/usr/bin/env python3

# Read the updated schedule content
with open('updated-schedule.html', 'r') as f:
    updated_schedule = f.read()

# Read the current index.html
with open('index.html', 'r') as f:
    index_content = f.read()

# Find the start and end of the schedule section
start_marker = '    <!-- Schedule Section -->'
end_marker = '    <!-- Course Facilitators Section -->'

# Find the positions
start_pos = index_content.find(start_marker)
end_pos = index_content.find(end_marker)

if start_pos == -1 or end_pos == -1:
    print("Could not find schedule section markers")
    exit(1)

# Extract the schedule content from updated-schedule.html
# Remove the outer section tags since we only want the content
schedule_start = updated_schedule.find('<div class="schedule-container">')
schedule_end = updated_schedule.find('</div>\n        </div>\n    </section>')

if schedule_start == -1 or schedule_end == -1:
    print("Could not find schedule content in updated file")
    exit(1)

# Extract just the schedule container content
schedule_content = updated_schedule[schedule_start:schedule_end + 6]  # +6 for </div>

# Replace the schedule section
new_content = index_content[:start_pos] + updated_schedule + index_content[end_pos:]

# Write the updated content
with open('index.html', 'w') as f:
    f.write(new_content)

print("Schedule section updated successfully!")
