import { cards, lessons, problems, primaryLesson } from '../data';
import { daysUntil } from './store';
import type { StudyState } from './types';
export function recommend(s:StudyState, now=Date.now()) {
 const due=cards.filter(c=>s.reviews[c.id] && s.reviews[c.id].due<=now).sort((a,b)=>(s.reviews[b.id].lapses-s.reviews[a.id].lapses));
 if(due.length) return {title:'Recall before you reread',description:`${due.length} reviewed cards are due. Retrieving an idea strengthens it more than rereading it.`,to:'/recall',label:'Review due cards',minutes:5};
 const recentMistake=s.mistakes.slice().sort((a,b)=>b.created-a.created).find(m=>{const id=primaryLesson[m.topic];return id && (!s.topics[id] || s.topics[id].updated<m.created);});
 if(recentMistake) return {title:'Turn a mistake into a mental model',description:`Your journal flagged ${recentMistake.topic}. Revisit its invariant, then test an edge case.`,to:'/lesson/'+primaryLesson[recentMistake.topic],label:'Revisit the lesson',minutes:10};
 const weak=Object.entries(s.topics).filter(([,p])=>p.confidence>0&&p.confidence<=2).sort((a,b)=>a[1].confidence-b[1].confidence||a[1].updated-b[1].updated)[0];
 if(weak) return {title:'Strengthen your weakest link',description:`You rated ${lessons.find(l=>l.id===weak[0])?.title??weak[0]} ${weak[1].confidence}/5. Practice explaining why it works.`,to:'/lesson/'+weak[0],label:'Build confidence',minutes:15};
 const weakProblem=problems.find(p=>s.problems[p.id]?.confidence>0&&s.problems[p.id].confidence<=2);
 if(weakProblem) return {title:'Revisit a low-confidence problem',description:`You rated ${weakProblem.name} ${s.problems[weakProblem.id].confidence}/5. Derive the approach again before looking at your notes.`,to:'/problem/'+weakProblem.id,label:'Practice again',minutes:15};
 const lastMock=s.mocks.at(-1);if(lastMock&&Object.values(lastMock.scores).some(x=>x<=2)&&now-lastMock.created<7*86400000)return {title:'Practice the reasoning you flagged',description:'Your latest mock self-assessment includes a score of 2 or lower. Use the structured lab to revisit your process.',to:'/lab',label:'Open the lab',minutes:15};
 const days=daysUntil(s.preferences.interviewDate,new Date(now));
 if(days>=0&&days<=3&&!s.mocks.some(m=>now-m.created<86400000))return {title:'Practice the whole conversation',description:`${days===0?'Your interview is today':`Your interview is in ${days} days`}. Rehearse clarifying, explaining, and testing under a timer.`,to:'/mock',label:'Start a mock interview',minutes:45};
 const next=['hashing','two-pointers','sliding-window','binary-search','bfs','trees','dp'].find(id=>!s.topics[id]?.completed);
 if(next) return {title:'Build a foundation you can reuse',description:`Work through ${lessons.find(l=>l.id===next)?.title}. Then explain the invariant without looking at the code.`,to:'/lesson/'+next,label:'Learn a concept',minutes:15};
 return {title:'Test your thinking on something unfamiliar',description:'Hide the category and derive a solution from the constraints. Your completed foundations are ready to apply.',to:'/practice',label:'Test my thinking',minutes:15};
}
