const fs = require('fs');
const path = require('path');

const tasksDir = path.join(__dirname, '..', '.tmp', 'tasks');

function fixSubtasks(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'completed') {
      fixSubtasks(fullPath);
    } else if (entry.name.match(/^subtask_\d{2}\.json$/)) {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      
      if (!content.hasOwnProperty('agent_id')) {
        // Add agent_id after suggested_agent or parallel
        const newContent = {};
        for (const [key, value] of Object.entries(content)) {
          newContent[key] = value;
          if (key === 'parallel' && !content.hasOwnProperty('agent_id')) {
            newContent['agent_id'] = null;
          }
        }
        // If agent_id wasn't added yet (no parallel field), add at end
        if (!newContent.hasOwnProperty('agent_id')) {
          newContent['agent_id'] = null;
        }
        
        fs.writeFileSync(fullPath, JSON.stringify(newContent, null, 2));
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

fixSubtasks(tasksDir);
console.log('Done fixing all subtask files');
