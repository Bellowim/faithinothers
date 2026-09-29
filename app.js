const pathways = {
  understand: {
    title: 'Listen across traditions',
    description: 'Faith in Others makes room to learn how another person lives their beliefs, in their own words. Start by listening for what matters to them.',
    question: 'What is something about your tradition or worldview that people often misunderstand?',
    theme: 'living'
  },
  question: {
    title: 'Make room for a real question',
    description: 'You can explore a changing belief without being asked to settle it today. Uncertainty can be the beginning of a more honest conversation.',
    question: 'What question has stayed with you even as your beliefs have changed?',
    theme: 'doubt'
  },
  common: {
    title: 'Find connection across difference',
    description: 'Shared ground does not require identical beliefs. Explore the hopes and responsibilities that can bring people together.',
    question: 'When have you found hope alongside someone who sees the world differently?',
    theme: 'hope'
  },
  story: {
    title: 'Bring your whole story',
    description: 'There is no single way to speak for a faith, a culture or a life. Begin with the part of your own experience you wish others could understand.',
    question: 'What part of your faith or worldview feels easiest or hardest to explain?',
    theme: 'belonging'
  }
};

const themes = {
  belonging: {
    number: '01 / BELONGING', title: 'Belonging',
    intro: 'Belonging can be found in a congregation, a family, a chosen community or a quiet practice. It can also be complicated. These questions invite personal stories rather than a single definition.',
    questions: [
      'When have you felt most at home in a community?',
      'What helps someone feel welcome without asking them to hide a part of themselves?',
      'Can belonging change when your beliefs change?'
    ]
  },
  doubt: {
    number: '02 / DOUBT & DISCOVERY', title: 'Doubt & discovery',
    intro: 'Some questions unsettle us. Others open a new way of seeing. Here, curiosity can sit beside conviction, and a question does not need an immediate conclusion.',
    questions: [
      'What question has helped you grow, even without a clear answer?',
      'How does your tradition or your own life make space for uncertainty?',
      'What have you learned by listening to someone who changed their mind?'
    ]
  },
  living: {
    number: '03 / LIVING TOGETHER', title: 'Living together',
    intro: 'Difference becomes real in our neighborhoods, friendships and daily choices. These prompts ask how we can be honest about disagreement while caring for the people beside us.',
    questions: [
      'What is something people often misunderstand about your tradition or worldview?',
      'How can we disagree well about something that matters deeply?',
      'What shared responsibility crosses the boundaries of belief?'
    ]
  },
  hope: {
    number: '04 / HOPE & REPAIR', title: 'Hope & repair',
    intro: 'Hope can be a belief, a practice or an act of solidarity. These questions leave space for grief, repair and the possibility of beginning again.',
    questions: [
      'What gives you hope when the world feels divided?',
      'What does repair look like after trust has been broken?',
      'Who taught you a way to begin again?'
    ]
  }
};

const choiceInputs = [...document.querySelectorAll('input[name="reason"]')];
const revealButton = document.getElementById('reveal-button');
const compassResult = document.getElementById('compass-result');
let suggestedTheme = null;

choiceInputs.forEach(input => input.addEventListener('change', () => {
  revealButton.disabled = false;
  compassResult.hidden = true;
}));

revealButton.addEventListener('click', () => {
  const selected = choiceInputs.find(input => input.checked);
  if (!selected) return;
  const pathway = pathways[selected.value];
  if (!pathway) return;
  suggestedTheme = pathway.theme;
  document.getElementById('result-title').textContent = pathway.title;
  document.getElementById('result-description').textContent = pathway.description;
  document.getElementById('result-question').textContent = pathway.question;
  compassResult.hidden = false;
  compassResult.focus();
});

document.getElementById('reset-compass').addEventListener('click', () => {
  choiceInputs.forEach(input => { input.checked = false; });
  revealButton.disabled = true;
  compassResult.hidden = true;
  suggestedTheme = null;
  choiceInputs[0].focus();
});

const themeDetail = document.getElementById('theme-detail');
const themeCards = [...document.querySelectorAll('.theme-card')];
let activeTheme = null;

function openTheme(key) {
  const theme = themes[key];
  if (!theme) return;
  activeTheme = key;
  themeCards.forEach(card => card.setAttribute('aria-pressed', String(card.dataset.theme === key)));
  document.getElementById('detail-number').textContent = theme.number;
  document.getElementById('detail-title').textContent = theme.title;
  document.getElementById('detail-intro').textContent = theme.intro;
  const list = document.getElementById('detail-list');
  list.replaceChildren(...theme.questions.map(question => {
    const item = document.createElement('li');
    item.textContent = question;
    return item;
  }));
  document.getElementById('copy-status').textContent = '';
  themeDetail.hidden = false;
  themeDetail.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  themeDetail.focus({preventScroll: true});
}

themeCards.forEach(card => card.addEventListener('click', () => openTheme(card.dataset.theme)));
document.getElementById('result-theme').addEventListener('click', () => openTheme(suggestedTheme));
document.getElementById('detail-close').addEventListener('click', () => {
  themeDetail.hidden = true;
  themeCards.forEach(card => card.setAttribute('aria-pressed', 'false'));
  const card = themeCards.find(item => item.dataset.theme === activeTheme);
  activeTheme = null;
  card?.focus();
});

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Copy unavailable');
}

document.getElementById('copy-question').addEventListener('click', async () => {
  if (!activeTheme) return;
  const status = document.getElementById('copy-status');
  try {
    await copyText(themes[activeTheme].questions[0]);
    status.textContent = 'Question copied. Share it with someone you would like to hear from.';
  } catch {
    status.textContent = 'Copy was unavailable. You can select the question above and copy it manually.';
  }
});
