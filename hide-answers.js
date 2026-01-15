

// <details>
// <summary>
// Answer
// </summary>

// ## Installation
// </details>

const fs = require('fs');
const readline = require('readline');

async function readLinesIntoArray(filePath) {
  const lines = [];
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Recognize all instances of CR LF ('\r\n') as a single line break
  });

  for await (const line of rl) {
    lines.push(line);
  }

  return lines;
}

function addItems(arr) {
    const res = []
    let num = 0;
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.length === 1) {
            res.push(element)
        } else {
            res.push(element.map(l => l.replace('[x]', '[ ]')))
            num = num + 1
            res.push([
                '',
                '<details>',
                '<summary>',
                'Answer ' + num,
                '</summary>',
                '',
                ...element,
                '</details>',
                '',
                '---',
                '',
                '...',
                '',
            ])
        }
    }

    return res
}

function saveToFile(lines, file) {
    const content = lines.map(arr => arr.join('\n')).join('\n');
    fs.writeFileSync(file, content, 'utf8');
}

function findConsecutiveStartingWith(arr, char) {
  let sequences = [];
  let current = [];

  for (let str of arr) {
    if (str.startsWith(char)) {
      current.push(str);
    } else {
        sequences.push([str]);

      if (current.length > 0) {
        sequences.push([...current]);
        current = [];
      }
    }
  }

  // Push the last sequence if it ended with a match
  if (current.length > 0) {
    sequences.push([...current]);
  }

  return sequences;
}



// Example usage:
readLinesIntoArray('README.md')
    .then(lines => {
        const grouped = findConsecutiveStartingWith(lines, "- [")
        const added = addItems(grouped)
        saveToFile(added, 'readme-edit.md')
        console.log(added);
    })
    .catch(err => console.error('Error reading file:', err));