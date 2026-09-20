import { useRef, useState } from 'react'
import { ReactFlow, Background, Controls, Handle, Position, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FileText, Sparkles, Share2, Plus, Newspaper, Link2, WandSparkles, GripVertical } from 'lucide-react'
import './App.css'

const article=[
{id:'lead',label:'LEAD',title:'정부, 도심 교통 혁신 위한 자율주행 시범사업 확대',body:'정부가 내년부터 자율주행 대중교통 시범사업을 전국 주요 도시로 확대한다. 시민의 이동 편의성을 높이고 미래 교통 산업의 기반을 마련한다는 계획이다.'},
{id:'fact',label:'FACT',title:'시범 지역 5곳 → 12곳',body:'국토교통부는 현재 5개 지역에서 운영 중인 자율주행 시범운행지구를 12개 지역으로 확대할 예정이라고 밝혔다.'},
{id:'quote',label:'QUOTE',title:'“일상에서 체감할 변화”',body:'정부 관계자는 “기술 실증을 넘어 시민들이 일상에서 직접 체감할 수 있는 서비스로 발전시키겠다”고 말했다.'},
{id:'context',label:'CONTEXT',title:'상용화 경쟁 가속',body:'국내 자율주행 시장은 규제 완화와 기술 투자 확대에 힘입어 빠르게 성장하고 있다. 업계는 이번 사업이 상용화를 앞당길 것으로 보고 있다.'},
{id:'outlook',label:'OUTLOOK',title:'2027년 정식 서비스 목표',body:'정부는 시범사업 결과를 바탕으로 안전 기준과 운영 지침을 정비해 2027년부터 단계적인 정식 서비스를 추진할 계획이다.'}]
const X=80,GAP=178
const makeNodes=()=>article.map((n,i)=>({id:n.id,position:{x:X,y:65+i*GAP},data:{...n,index:i},type:'article'}))
function ArticleNode({data}){return <div className="node"><Handle type="target" position={Position.Top} isConnectable={false}/><div className="nodeTop"><div className={'tag '+data.label.toLowerCase()}>{String(data.index+1).padStart(2,'0')} · {data.label}</div><GripVertical size={15}/></div><h3>{data.title}</h3><p>{data.body}</p><div className="nodefoot"><span>¶ 기사 문단</span><span>위아래로 이동</span></div><Handle type="source" position={Position.Bottom} isConnectable={false}/></div>}
function App(){
 const [nodes,setNodes,onNodesChange]=useNodesState(makeNodes()); const [split,setSplit]=useState(48); const [dropIndex,setDropIndex]=useState(null); const shell=useRef(null)
 const ordered=[...nodes].sort((a,b)=>a.position.y-b.position.y); const edges=ordered.slice(0,-1).map((n,i)=>({id:'e-'+n.id,source:n.id,target:ordered[i+1].id,type:'smoothstep'}))
 const drag=(_,n)=>setDropIndex(Math.max(0,Math.min(nodes.length-1,Math.round((n.position.y-65)/GAP))))
 const snap=(_,dragged)=>{const others=ordered.filter(n=>n.id!==dragged.id); const rank=dropIndex??0; others.splice(rank,0,dragged);setNodes(others.map((n,i)=>({...n,position:{x:X,y:65+i*GAP},data:{...n.data,index:i}})));setDropIndex(null)}
 const resize=(e)=>{e.preventDefault();const move=ev=>{const r=shell.current.getBoundingClientRect();setSplit(Math.max(30,Math.min(70,((ev.clientX-r.left)/r.width)*100)))};const up=()=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up)};addEventListener('pointermove',move);addEventListener('pointerup',up)}
 return <div className="app"><header><div className="brand"><div className="mark"><Share2 size={18}/></div><b>NodeArticle</b><span>STORY COMPOSER</span></div><button className="primary"><Sparkles size={16}/> 기사 생성</button></header>
 <aside><div className="new"><Plus size={17}/> 새 기사</div><nav><div className="navtitle">WORKSPACE</div><a className="active"><Newspaper/>스토리 에디터</a><a><FileText/>소스 라이브러리</a><a><WandSparkles/>AI 생성 기록</a></nav><div className="recent"><div className="navtitle">RECENT STORIES</div><p className="sel">자율주행 시범사업 확대</p><p>AI 반도체 투자 계획</p></div></aside>
 <main><section className="topline"><div><div className="crumb">STORIES / DRAFT</div><h1>자율주행 시범사업 확대</h1><p>왼쪽에서 구조를 바꾸면 오른쪽 기사가 즉시 재구성됩니다.</p></div></section>
 <section className="sourcebar"><div><Link2/><span><b>연결된 소스 3개</b><small>보도자료 · 브리핑 · 시장 리포트</small></span></div><button>소스 보기 →</button></section>
 <div className="workspace" ref={shell}><section className="graphPane" style={{width:split+'%'}}><div className="paneHead"><b>ARTICLE FLOW</b><span>드래그하면 삽입 위치가 표시됩니다</span></div><div className="flowWrap">{dropIndex!==null&&<div className="dropMarker" style={{top:65+dropIndex*GAP-12}}><span>여기에 삽입</span></div>}<ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onNodeDrag={drag} onNodeDragStop={snap} nodeTypes={{article:ArticleNode}} nodesConnectable={false} fitView fitViewOptions={{padding:.1}}><Background gap={24} size={1}/><Controls/></ReactFlow></div></section>
 <div className="splitter" onPointerDown={resize}><div></div></div>
 <section className="articlePane" style={{width:(100-split)+'%'}}><div className="paneHead"><b>LIVE ARTICLE</b><span>노드 순서와 실시간 동기화</span></div><article><div className="kicker">TECH · MOBILITY</div><h2>{ordered[0].data.title}</h2><div className="by">김아름 기자 · DRAFT</div>{ordered.map((x,i)=><div className="articlePara" key={x.id}><small>{String(i+1).padStart(2,'0')} · {x.data.label}</small><p>{x.data.body}</p></div>)}</article></section></div>
 <footer><span><b>{nodes.length}</b> 문단 · 자동 연결</span><span>가운데 분할선을 드래그해 작업 영역 크기를 조절하세요</span></footer></main></div>}
export default App