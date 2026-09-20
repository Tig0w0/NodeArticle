import { useState } from 'react'
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FileText, Sparkles, Share2, Eye, Plus, Newspaper, Link2, WandSparkles } from 'lucide-react'
import './App.css'

const article = [
  { id:'lead', label:'LEAD', title:'정부, 도심 교통 혁신 위한 자율주행 시범사업 확대', body:'정부가 내년부터 자율주행 대중교통 시범사업을 전국 주요 도시로 확대한다. 시민의 이동 편의성을 높이고 미래 교통 산업의 기반을 마련한다는 계획이다.', x:40, y:40 },
  { id:'fact', label:'FACT', title:'시범 지역 5곳 → 12곳', body:'국토교통부는 현재 5개 지역에서 운영 중인 자율주행 시범운행지구를 12개 지역으로 확대할 예정이라고 밝혔다.', x:430, y:40 },
  { id:'quote', label:'QUOTE', title:'“일상에서 체감할 변화”', body:'정부 관계자는 “기술 실증을 넘어 시민들이 일상에서 직접 체감할 수 있는 서비스로 발전시키겠다”고 말했다.', x:430, y:250 },
  { id:'context', label:'CONTEXT', title:'상용화 경쟁 가속', body:'국내 자율주행 시장은 규제 완화와 기술 투자 확대에 힘입어 빠르게 성장하고 있다. 업계는 이번 사업이 상용화를 앞당길 것으로 보고 있다.', x:820, y:145 },
  { id:'outlook', label:'OUTLOOK', title:'2027년 정식 서비스 목표', body:'정부는 시범사업 결과를 바탕으로 안전 기준과 운영 지침을 정비해 2027년부터 단계적인 정식 서비스를 추진할 계획이다.', x:1210, y:145 },
]
const initialNodes=article.map(n=>({id:n.id,position:{x:n.x,y:n.y},data:n,type:'article'}))
const initialEdges=[['lead','fact'],['fact','quote'],['quote','context'],['context','outlook']].map(([s,t],i)=>({id:'e'+i,source:s,target:t,animated:true}))
function ArticleNode({data}){return <div className="node"><Handle type="target" position={Position.Left}/><div className={'tag '+data.label.toLowerCase()}>{data.label}</div><h3>{data.title}</h3><p>{data.body}</p><div className="nodefoot"><span>¶ 문단</span><span>⋮</span></div><Handle type="source" position={Position.Right}/></div>}
function App(){
 const [nodes,setNodes,onNodesChange]=useNodesState(initialNodes); const [edges,setEdges,onEdgesChange]=useEdgesState(initialEdges); const [mode,setMode]=useState('graph')
 return <div className="app"><header><div className="brand"><div className="mark"><Share2 size={18}/></div><b>NodeArticle</b><span>STORY COMPOSER</span></div><div className="headActions"><button className="ghost"><Eye size={16}/> 미리보기</button><button className="primary"><Sparkles size={16}/> 기사 생성</button></div></header>
 <aside><div className="new"><Plus size={17}/> 새 기사</div><nav><div className="navtitle">WORKSPACE</div><a className="active"><Newspaper/>스토리 에디터</a><a><FileText/>소스 라이브러리</a><a><WandSparkles/>AI 생성 기록</a></nav><div className="recent"><div className="navtitle">RECENT STORIES</div><p className="sel">자율주행 시범사업 확대</p><p>AI 반도체 투자 계획</p><p>도심 재개발 정책 발표</p></div><div className="profile"><div>KA</div><span><b>김아름 기자</b><small>Demo workspace</small></span></div></aside>
 <main><section className="topline"><div><div className="crumb">STORIES / DRAFT</div><h1>자율주행 시범사업 확대</h1><p>소스를 바탕으로 생성된 문단을 연결해 기사의 흐름을 설계하세요.</p></div><div className="switch"><button onClick={()=>setMode('graph')} className={mode==='graph'?'on':''}><Share2/>노드</button><button onClick={()=>setMode('article')} className={mode==='article'?'on':''}><FileText/>기사</button></div></section>
 <section className="sourcebar"><div><Link2/><span><b>연결된 소스 3개</b><small>보도자료 · 브리핑 · 시장 리포트</small></span></div><button>소스 보기 →</button></section>
 {mode==='graph'?<div className="canvas"><div className="canvashead"><span><i></i> ARTICLE FLOW</span><small>노드를 드래그하고 연결해 문단 순서를 바꿀 수 있습니다</small></div><ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={{article:ArticleNode}} fitView><Background gap={24} size={1}/><Controls/></ReactFlow></div>:<div className="preview"><div className="kicker">TECH · MOBILITY</div><h2>{article[0].title}</h2><div className="by">김아름 기자 · 방금 전</div>{article.map((x,i)=><p key={i}>{x.body}</p>)}</div>}
 <footer><span><b>{nodes.length}</b> 문단 <b>{edges.length}</b> 연결</span><span>드래그하여 재배치 · 핸들을 연결하여 흐름 변경</span></footer></main></div>
}
export default App