/*
 * Question controls — render a single question as accessible form controls.
 *
 * UI helper only; contains no business logic and no question content. Supports
 * the two structured answer types used by the questionnaire: 'single'
 * (radio group) and 'multi' (checkbox group). Large touch targets and proper
 * fieldset/legend/label semantics for accessibility.
 */

/**
 * @param {object} question - { id, type, label, help?, options }
 * @param {object} answers  - current answers map
 * @param {(value:string|string[])=>void} onChange
 * @returns {HTMLElement}
 */
export function renderQuestion(question, answers, onChange) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'question';

  const legend = document.createElement('legend');
  legend.className = 'question__label';
  legend.textContent = question.label;
  fieldset.appendChild(legend);

  if (question.help) {
    const help = document.createElement('p');
    help.className = 'question__help muted';
    help.textContent = question.help;
    fieldset.appendChild(help);
  }

  const current = answers[question.id];
  const isMulti = question.type === 'multi';

  // Multi-select hint above the options; single-select shows nothing.
  if (isMulti) {
    const hint = document.createElement('p');
    hint.className = 'multi-hint';
    hint.textContent = 'Mehrfachauswahl möglich';
    fieldset.appendChild(hint);
  }

  const list = document.createElement('div');
  list.className = 'options';

  for (const opt of question.options) {
    const label = document.createElement('label');
    label.className = 'option';

    const input = document.createElement('input');
    input.type = isMulti ? 'checkbox' : 'radio';
    input.name = question.id;
    input.value = opt.value;

    if (isMulti) {
      input.checked = Array.isArray(current) && current.includes(opt.value);
    } else {
      input.checked = current === opt.value;
    }

    input.addEventListener('change', () => {
      if (isMulti) {
        const set = new Set(Array.isArray(answers[question.id]) ? answers[question.id] : []);
        if (input.checked) set.add(opt.value); else set.delete(opt.value);
        onChange([...set]);
      } else {
        onChange(opt.value);
      }
      // Reflect selected state visually on the option rows.
      for (const row of list.querySelectorAll('.option')) {
        const rowInput = row.querySelector('input');
        row.classList.toggle('option--selected', rowInput.checked);
      }
    });

    if (input.checked) label.classList.add('option--selected');

    const text = document.createElement('span');
    text.textContent = opt.label;

    label.appendChild(input);
    label.appendChild(text);
    list.appendChild(label);
  }

  fieldset.appendChild(list);
  return fieldset;
}
