// Step 1: reusable card data (replace with your supplied JSON seed if needed)
const FALLBACK = [
  {id:1,title:"Frontend Intern",company:"BrightLeaf Labs",domain:"Web Development",location:"Coimbatore",mode:"Hybrid",duration:"3 months",skills:["HTML","CSS","JavaScript"],url:"#"},
  {id:2,title:"UI/UX Design Intern",company:"Pixel Harbor",domain:"Design",location:"Remote",mode:"Remote",duration:"2 months",skills:["Figma","Research"],url:"#"},
  {id:3,title:"Data Analyst Intern",company:"Numera Analytics",domain:"Data",location:"Chennai",mode:"On-site",duration:"6 months",skills:["Python","SQL","Excel"],url:"#"},
  {id:4,title:"Content Writing Intern",company:"Inkwell Media",domain:"Marketing",location:"Remote",mode:"Remote",duration:"3 months",skills:["Writing","SEO"],url:"#"},
  {id:5,title:"React Developer Intern",company:"Northwind Apps",domain:"Web Development",location:"Bengaluru",mode:"Hybrid",duration:"4 months",skills:["React","Git"],url:"#"},
  {id:6,title:"ML Research Intern",company:"Cortex Works",domain:"Data",location:"Remote",mode:"Remote",duration:"6 months",skills:["Python","Statistics"],url:"#"}
];

const $ = id => document.getElementById(id);
const els = {search:$("search"),domain:$("domain"),reset:$("reset"),results:$("results"),count:$("count"),message:$("message")};
let internships = [];

// Step 2: load data with error handling (tries data/internships.json, falls back to built-in list)
async function load(){
  try{
    const res = await fetch("data/internships.json");
    if(!res.ok) throw new Error("HTTP "+res.status);
    internships = await res.json();
  }catch(e){
    internships = FALLBACK;
  }
  if(!Array.isArray(internships)){ showError(); return; }
  fillDomains();
  render();
}

function fillDomains(){
  [...new Set(internships.map(i=>i.domain))].sort().forEach(d=>{
    const o = document.createElement("option"); o.value = d; o.textContent = d; els.domain.append(o);
  });
}

function showError(){
  els.results.innerHTML = "";
  els.message.className = "message error"; els.message.hidden = false;
  els.message.textContent = "Internships could not be loaded. Check your connection and refresh the page.";
}

// Step 3: filter by search text + domain
function filtered(){
  const q = els.search.value.trim().toLowerCase();
  const d = els.domain.value;
  return internships.filter(i=>{
    const text = [i.title,i.company,i.location,i.domain,...(i.skills||[])].join(" ").toLowerCase();
    return (d==="all"||i.domain===d) && text.includes(q);
  });
}

function card(i){
  const li = document.createElement("article"); li.className = "card";
  const h = document.createElement("h2"); h.textContent = i.title;
  const co = document.createElement("p"); co.className = "co"; co.textContent = `${i.company} · ${i.location} (${i.mode})`;
  const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = `${i.domain} · ${i.duration}`;
  const ul = document.createElement("ul"); ul.className = "skills"; ul.setAttribute("aria-label","Skills");
  (i.skills||[]).forEach(s=>{const x=document.createElement("li"); x.textContent=s; ul.append(x);});
  const a = document.createElement("a"); a.href = i.url||"#"; a.textContent = "View details";
  a.setAttribute("aria-label",`View details for ${i.title} at ${i.company}`);
  li.append(h,co,tag,ul,a); return li;
}

// Step 4: render with empty state
function render(){
  const list = filtered();
  els.results.replaceChildren(...list.map(card));
  els.count.textContent = `${list.length} of ${internships.length} internships shown`;
  if(!list.length){
    els.message.className = "message"; els.message.hidden = false;
    els.message.textContent = "No internships match. Try a different word or choose All domains.";
  } else els.message.hidden = true;
}

els.search.addEventListener("input", render);
els.domain.addEventListener("change", render);
els.reset.addEventListener("click", ()=>{els.search.value="";els.domain.value="all";render();els.search.focus();});
load();
