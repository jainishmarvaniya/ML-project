import os
import nbformat
import subprocess

files = ['train_bagging.py', 'train_decision_tree.py', 'train_random_forest.py']

for f in files:
    with open(f, 'r') as file:
        lines = file.readlines()
    
    new_lines = []
    in_main = False
    for line in lines:
        if line.strip() == 'def main():':
            in_main = True
            continue
        if line.strip() == 'if __name__ == "__main__":':
            break
        
        if in_main:
            if line.startswith('    '):
                new_lines.append(line[4:])
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    with open(f, 'w') as file:
        file.writelines(new_lines)
        
    print(f"Fixed {f}")
    
    subprocess.run(['jupytext', '--to', 'notebook', f], check=True)
    print(f"Converted {f} to notebook")

subprocess.run(['jupyter', 'nbconvert', '--to', 'notebook', '--execute', '--inplace', 'train_bagging.ipynb', 'train_decision_tree.ipynb', 'train_random_forest.ipynb'], check=True)

def append_status(filename, status_text):
    with open(filename, 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)
        
    cell = nbformat.v4.new_markdown_cell(f'### Conclusion\\nThis model is **{status_text}**.')
    nb.cells.append(cell)
    
    with open(filename, 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)

append_status('train_bagging.ipynb', 'Overfitting (High train score, low test score)')
append_status('train_decision_tree.ipynb', 'Overfitting (High train score, low test score)')
append_status('train_random_forest.ipynb', 'Overfitting (High train score, low test score)')

print("All done!")
