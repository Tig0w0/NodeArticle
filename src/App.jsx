import {useEffect,useMemo,useRef,useState} from 'react'
import {ReactFlow,Background,Controls,MiniMap,Handle,Position,applyNodeChanges} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {Plus,Search,X,Trash2,Upload,GripVertical,Link2,FileText,Music2,Image as ImageIcon,Map,FileCheck2,ChevronLeft,ChevronRight} from 'lucide-react'
import './App.css'
import {BUS_IMG} from './busData'

const colors={TITLE:'#f26f7d',LEAD:'#62c99a',FACT:'#f7b928',IMAGE:'#9366e8',QUOTE:'#5b9af0',CONTEXT:'#2bb1c0',OUTLOOK:'#718096'}
const baseArticle=[
{id:'title',type:'article',position:{x:220,y:40},data:{role:'TITLE',kind:'title',summary:'서울시, 자율주행 버스\n시범운행 시작',body:''}},
{id:'lead',type:'article',position:{x:220,y:200},data:{role:'LEAD',summary:'도입 - 새로운 전환점',body:'서울시가 26일부터 자율주행 버스 시범운행을 시작했다. 도심 교통의 새로운 전환점으로, 시민들이 직접 자율주행 기술을 체험할 수 있는 첫 사례다.'}},
{id:'fact',type:'article',position:{x:220,y:430},data:{role:'FACT',summary:'시범운행 구간과 운영 계획',body:'서울시는 시청에서 청계천, 서울역을 잇는 구간(총 7.2km)에서 자율주행 버스를 시범 운행한다. 평일 기준 하루 10회 운행되며, 일반 시민도 무료로 탑승할 수 있다.'}},
{id:'image',type:'article',position:{x:220,y:670},data:{role:'IMAGE',kind:'image',summary:'현장 사진',body:'서울시 자율주행 버스가 청계천 인근을 주행하고 있다. (사진=서울시)'}},
{id:'quote',type:'article',position:{x:220,y:920},data:{role:'QUOTE',summary:'“시민 체감이 가장 중요합니다”',body:'서울시 교통정책과 김정호 과장은 인터뷰에서 “기술도 중요하지만, 시민들이 실제로 체험할 수 있는 안전성과 편의성이 핵심”이라고 말했다.'}},
{id:'context',type:'article',position:{x:220,y:1160},data:{role:'CONTEXT',summary:'국내외 자율주행 정책 동향',body:'국토부는 올해 자율주행 상용화를 위한 규제를 정비하고 있으며, 해외 주요 도시들도 유사한 시범사업을 확대하고 있다.'}},
{id:'outlook',type:'article',position:{x:220,y:1390},data:{role:'OUTLOOK',summary:'남은 과제와 향후 전망',body:'전문가들은 기술적 완성도와 시민 수용성이 확보된다면, 서울시는 이번 시범운행을 통해 수집한 데이터를 바탕으로 운영을 점진적으로 확대할 계획이라고 전망했다.'}},
]
const evidence=[
{id:'e1',type:'evidence',position:{x:15,y:245},data:{icon:'pdf',title:'서울시 보도자료',meta:'p.1-3'},target:'lead',side:'left'},
{id:'e2',type:'evidence',position:{x:575,y:260},data:{icon:'web',title:'관련 기사 모음',meta:'3개 기사'},target:'lead',side:'right'},
{id:'e3',type:'evidence',position:{x:15,y:490},data:{icon:'pdf',title:'국토부 정책보고서',meta:'p.12-18'},target:'fact',side:'left'},
{id:'e4',type:'evidence',position:{x:575,y:445},data:{icon:'map',title:'노선 지도',meta:'서울시 제공'},target:'fact',side:'right'},
{id:'e5',type:'evidence',position:{x:575,y:535},data:{icon:'doc',title:'운영 계획안',meta:'내부 문서'},target:'fact',side:'right'},
{id:'e6',type:'evidence',position:{x:15,y:735},data:{icon:'image',title:'현장 사진',meta:'서울시 제공'},target:'image',side:'left'},
{id:'e7',type:'evidence',position:{x:10,y:980},data:{icon:'audio',title:'김정호 과장 인터뷰',meta:'14:32 - 16:10'},target:'quote',side:'left'},
{id:'e8',type:'evidence',position:{x:575,y:990},data:{icon:'doc',title:'인터뷰 전문 텍스트',meta:'자동 전사본'},target:'quote',side:'right'},
{id:'e9',type:'evidence',position:{x:15,y:1225},data:{icon:'doc',title:'해외 사례 기사',meta:'2개 기사'},target:'context',side:'left'},
{id:'e10',type:'evidence',position:{x:575,y:1225},data:{icon:'doc',title:'전문가 의견',meta:'업계 전문가 인터뷰'},target:'context',side:'right'},
{id:'e11',type:'evidence',position:{x:15,y:1460},data:{icon:'doc',title:'전문가 인터뷰',meta:'3개 의견'},target:'outlook',side:'left'},
]
function iconFor(k){if(k==='audio')return <Music2/>;if(k==='image')return <ImageIcon/>;if(k==='map')return <Map/>;if(k==='doc')return <FileCheck2/>;return <FileText/>}
function ArticleNode({data,selected}){return <div className={'articleNode '+data.role.toLowerCase()+(selected?' selected':'')} style={{'--accent':colors[data.role]}}>
 <Handle id="flow-in" type="target" position={Position.Top} className="flowHandle"/>
 <Handle id="ref-left" type="target" position={Position.Left} className="refHandle"/>
 <div className="nodeTop"><span className="num">{data.num}</span><b className="role">{data.role}</b><GripVertical/></div>
 {data.kind==='image'?<><img src={BUS_IMG} className="nodePhoto"/><small>{data.body}</small></>:<><strong>{data.summary}</strong>{data.role!=='TITLE'&&<p>{data.body}</p>}</>}
 <Handle id="ref-right" type="source" position={Position.Right} className="refHandle"/>
 <Handle id="flow-out" type="source" position={Position.Bottom} className="flowHandle"/>
 </div>}
function EvidenceNode({data}){return <div className="evidenceNode">
 <Handle id="ev-in" type="target" position={Position.Left}/>
 <Handle id="ev-out" type="source" position={Position.Right}/>
 <span className={'evIcon '+data.icon}>{iconFor(data.icon)}</span><span><b>{data.title}</b><small>{data.meta}</small></span>
 </div>}
const nodeTypes={article:ArticleNode,evidence:EvidenceNode}

const sourceItems=[
['pdf','서울시 보도자료','PDF · 2.3MB'],['audio','자율주행 인터뷰_김정호.mp3','오디오 · 48:12'],['pdf','국토부 자율주행 정책보고서','PDF · 5.1MB'],['image','서울시 자율주행 시범운행.jpg','이미지 · 1.2MB'],['web','관련 기사 모음','웹페이지 · 12개'],['doc','업계 전문가 인터뷰','문서 · 32KB']]
function Sources({collapsed,onToggle}){return <aside className={"sourcesPanel"+(collapsed?" collapsed":"")}><div className="sideHead">{!collapsed&&<b>Sources</b>}<div className="sourceHeadActions">{!collapsed&&<button><Plus/>추가</button>}<button className="collapseSource" onClick={onToggle} title={collapsed?"Sources 펼치기":"Sources 접기"}>{collapsed?<ChevronRight/>:<ChevronLeft/>}</button></div></div>{collapsed?<div className="collapsedSourceRail"><FileText/><Music2/><ImageIcon/><Link2/></div>:<><div className="sourceTabs"><b>전체</b><span>문서</span><span>오디오</span><span>웹</span><span>이미지</span></div><div className="sourceSearch"><Search/>자료 검색...</div><div className="sourceItems">{sourceItems.map(([k,t,m])=><div className="sourceItem" key={t}><span className={"srcIcon "+k}>{iconFor(k)}</span><span><b>{t}</b><small>{m}</small></span></div>)}</div><div className="addSource"><Plus/> 더 많은 자료 추가<div className="sourceButtons"><button>◢</button><button>▶</button><button>🔗</button></div><small>또는 파일을 드래그하세요</small></div></>}</aside>}
function Properties({node,onChange}){return <aside className="properties"><div className="propHead"><b>Node Properties</b><X/></div><div className="propTabs"><b>기본 정보</b><span>연결된 자료</span></div><label>노드 타입</label><div className="selectBox"><i style={{background:colors[node.data.role]}}/>{node.data.role}<span>⌄</span></div><label>노드 요약명<small>(편집용, 기사에 표시되지 않음)</small></label><input value={node.data.summary} onChange={e=>onChange('summary',e.target.value)}/><label>본문 내용<small>(실제 기사에 포함되는 텍스트)</small></label><textarea value={node.data.body} onChange={e=>onChange('body',e.target.value)}/><div className="linkedHead"><b>연결된 근거 자료 (4)</b><button>+ 추가</button></div><div className="linkedList"><div>🗺️ 노선 지도 <X/></div><div>📕 국토부 정책보고서 <X/></div><div>📘 운영 계획안 <X/></div><div>🎵 관계자 인터뷰 <X/></div></div><label>노드 색상</label><div className="colorDots">{Object.values(colors).slice(1).map(c=><i key={c} style={{background:c}}/>)}</div><div className="propActions"><button>↑　위로 이동</button><button>↓　아래로 이동</button><button>▣　복제</button><button className="danger"><Trash2/> 노드 삭제</button></div></aside>}
function Graph({articles,setArticles,setSelected,scale=1}){
 const ordered=useMemo(()=>[...articles].sort((a,b)=>a.position.y-b.position.y),[articles])
 const slots=[40,200,430,670,920,1160,1390]
 const ghostRef=useRef(null),flowRef=useRef(null),insertRef=useRef(0),dragIdRef=useRef(null),dragStartRef=useRef(null)
 const [draggingId,setDraggingId]=useState(null)

 const evNodes=useMemo(()=>evidence.map(e=>{
  const base=baseArticle.find(n=>n.id===e.target)?.position.y||e.position.y
  const target=articles.find(n=>n.id===e.target)?.position.y||base
  return {...e,draggable:false,position:{...e.position,y:target+(e.position.y-base)}}
 }),[articles])

 const staticNodes=useMemo(()=>[
  ...ordered.map((n,i)=>({...n,draggable:n.data.role!=='TITLE',data:{...n.data,num:String(i+1).padStart(2,'0')}})),
  ...evNodes
 ],[ordered,evNodes])

 const [displayNodes,setDisplayNodes]=useState(staticNodes)
 useEffect(()=>{if(!dragIdRef.current)setDisplayNodes(staticNodes)},[staticNodes])

 const graphExtent=useMemo(()=>{
  const source=staticNodes
  const minX=Math.min(...source.map(n=>n.position.x))
  const maxX=Math.max(...source.map(n=>n.position.x+(n.type==='article'?260:132)))
  const minY=Math.min(...source.map(n=>n.position.y))
  const maxY=Math.max(...source.map(n=>n.position.y+(n.type==='article'?(n.data?.kind==='image'?210:150):72)))
  const padX=240,padTop=180,padBottom=320
  return [[minX-padX,minY-padTop],[maxX+padX,maxY+padBottom]]
 },[staticNodes])

 const normalEdges=useMemo(()=>{
  const main=ordered.slice(0,-1).map((n,i)=>({
   id:'m'+i,source:n.id,target:ordered[i+1].id,sourceHandle:'flow-out',targetHandle:'flow-in',type:'smoothstep',className:'mainEdge'
  }))
  const refs=evidence.map((e,i)=>({
   id:'r'+i,source:e.side==='left'?e.id:e.target,target:e.side==='left'?e.target:e.id,
   sourceHandle:e.side==='left'?'ev-out':'ref-right',targetHandle:e.side==='left'?'ref-left':'ev-in',
   type:'smoothstep',className:'refEdge',
   label:e.target==='lead'?'근거':e.target==='fact'?(i%2?'참고':'근거'):e.target==='quote'?'근거':e.target==='context'?'참고':'근거'
  }))
  return [...main,...refs]
 },[ordered])

 const dragEdges=useMemo(()=>{
  if(!draggingId)return normalEdges
  const spine=ordered.filter(n=>n.id!==draggingId)
  const main=spine.slice(0,-1).map((n,i)=>({
   id:'drag-m'+i,source:n.id,target:spine[i+1].id,sourceHandle:'flow-out',targetHandle:'flow-in',type:'smoothstep',className:'mainEdge'
  }))
  const refs=normalEdges.filter(e=>e.className==='refEdge'&&e.source!==draggingId&&e.target!==draggingId)
  return [...main,...refs]
 },[draggingId,ordered,normalEdges])

 const onNodesChange=changes=>{
  if(!dragIdRef.current){setDisplayNodes(prev=>applyNodeChanges(changes,prev));return}
  setDisplayNodes(prev=>applyNodeChanges(changes.filter(c=>!(c.type==='position'&&c.id===dragIdRef.current)),prev))
 }

 const buildGhost=node=>{
  if(!ghostRef.current)return
  const src=document.querySelector('.react-flow__node[data-id="'+node.id+'"] .articleNode')
  if(!src)return
  const clone=src.cloneNode(true)
  clone.classList.remove('selected')
  clone.classList.add('slotGhostCard')
  clone.querySelectorAll('.react-flow__handle').forEach(h=>h.remove())
  ghostRef.current.replaceChildren(clone)
  ghostRef.current.style.display='block'
 }

 const getInsertIndex=y=>{
  const targetSlots=slots.slice(1,ordered.length)
  let idx=0,best=Infinity
  targetSlots.forEach((slotY,i)=>{const d=Math.abs(y-slotY);if(d<best){best=d;idx=i}})
  return Math.max(0,Math.min(ordered.length-2,idx))
 }

 const updatePreview=(dragId,dragPos)=>{
  const title=ordered.find(n=>n.data.role==='TITLE')
  const dragged=ordered.find(n=>n.id===dragId)
  if(!dragged||!title)return

  const others=ordered.filter(n=>n.id!==dragId&&n.data.role!=='TITLE')
  const idx=getInsertIndex(dragPos.y)
  insertRef.current=idx

  const previewOrder=[...others]
  previewOrder.splice(idx,0,dragged)
  const full=[title,...previewOrder]

  const desiredY={}
  full.forEach((n,i)=>{if(n.id!==dragId)desiredY[n.id]=slots[i]??40+i*230})

  const articlePreview=ordered.map((n,i)=>{
   const num=String(i+1).padStart(2,'0')
   if(n.id===dragId)return {...n,draggable:true,position:dragPos,data:{...n.data,num}}
   return {...n,draggable:n.data.role!=='TITLE',position:{x:220,y:desiredY[n.id]??n.position.y},data:{...n.data,num}}
  })

  const evidencePreview=evNodes.map(ev=>{
   const meta=evidence.find(e=>e.id===ev.id)
   if(meta?.target===dragId)return {...ev,hidden:true}
   const articleNow=ordered.find(n=>n.id===meta?.target)
   const targetY=desiredY[meta?.target]
   const dy=articleNow&&targetY!=null?targetY-articleNow.position.y:0
   return {...ev,hidden:false,position:{x:ev.position.x,y:ev.position.y+dy}}
  })

  setDisplayNodes([...articlePreview,...evidencePreview])

  if(ghostRef.current&&flowRef.current){
   const {x,y,zoom}=flowRef.current.getViewport()
   const ghostY=slots[idx+1]??200+idx*230
   const g=ghostRef.current
   g.style.left=(220*zoom+x)+'px'
   g.style.top=(ghostY*zoom+y)+'px'
   g.style.transform='scale('+zoom+')'
   g.style.transformOrigin='top left'
   g.style.display='block'
  }
 }

 const start=(event,node)=>{
  if(node.type!=='article'||node.data.role==='TITLE')return
  dragIdRef.current=node.id
  setDraggingId(node.id)
  dragStartRef.current={clientX:event.clientX,clientY:event.clientY,x:node.position.x,y:node.position.y}
  buildGhost(node)
  updatePreview(node.id,node.position)
 }

 const move=(event,node)=>{
  if(node.type!=='article'||node.data.role==='TITLE'||!dragStartRef.current)return
  const v=flowRef.current?.getViewport?.()||{zoom:1}
  const factor=Math.max(.01,(v.zoom||1)*(scale||1))
  const rawX=dragStartRef.current.x+(event.clientX-dragStartRef.current.clientX)/factor
  const rawY=dragStartRef.current.y+(event.clientY-dragStartRef.current.clientY)/factor
  const pos={
   x:Math.max(graphExtent[0][0],Math.min(graphExtent[1][0]-260,rawX)),
   y:Math.max(graphExtent[0][1],Math.min(graphExtent[1][1]-150,rawY))
  }
  updatePreview(node.id,pos)
 }

 const drop=(_,node)=>{
  if(node.type!=='article'||node.data.role==='TITLE')return
  const idx=insertRef.current
  setArticles(list=>{
   const title=list.find(n=>n.data.role==='TITLE')
   const moved=list.find(n=>n.id===node.id)
   const rest=list.filter(n=>n.id!==node.id&&n.data.role!=='TITLE').sort((a,b)=>a.position.y-b.position.y)
   rest.splice(idx,0,moved)
   return [title,...rest].filter(Boolean).map((n,i)=>({...n,position:{x:220,y:slots[i]??40+i*230}}))
  })
  setSelected(node.id)
  dragIdRef.current=null
  dragStartRef.current=null
  setDraggingId(null)
  if(ghostRef.current){ghostRef.current.style.display='none';ghostRef.current.replaceChildren()}
 }

 return <section className="graphPanel">
  <div className="graphHead"><b>Article Graph</b><div className="graphTools"><span className="dragHint">노드 드래그 → 순서 변경</span><button>↖</button><button>☝</button><button>100%</button><button>⌕</button><button>⛶</button><button className="addNode">노드 추가</button><button>⛶</button></div></div>
  <div className="flowCanvas"><div ref={ghostRef} className="slotGhost"/>
   <ReactFlow nodes={displayNodes} edges={dragEdges} onNodesChange={onNodesChange} nodeTypes={nodeTypes} onInit={i=>flowRef.current=i}
    onNodeClick={(_,n)=>n.type==='article'&&setSelected(n.id)} onNodeDragStart={start} onNodeDrag={move} onNodeDragStop={drop}
    defaultViewport={{x:92,y:-14,zoom:.74}} minZoom={.35} maxZoom={1.6} panOnDrag nodesDraggable
    translateExtent={graphExtent} nodeExtent={graphExtent}>
    <Background variant="dots" gap={18} size={1}/><MiniMap pannable zoomable position="bottom-left"/><Controls position="top-right"/>
   </ReactFlow>
  </div>
 </section>
}
function LiveArticle({articles}){const o=[...articles].sort((a,b)=>a.position.y-b.position.y);return <section className="livePanel"><div className="liveHead"><b>Live Article</b><div><button>◉ 미리보기</button><button>⛶ 전체화면</button></div></div><article><h1>{o[0].data.summary}</h1><div className="deck">도심 교통의 새로운 전환점… 안전성과 시민 체감도가 관건</div><div className="author"><span className="avatar">●</span><b>김민수 기자</b><span>◷ 2024. 11. 26. 10:24</span></div>{o.slice(1).map(n=>n.data.kind==='image'?<figure key={n.id}><img src={BUS_IMG}/><figcaption>▣ {n.data.body}</figcaption></figure>:n.data.role==='QUOTE'?<blockquote key={n.id}><b>{n.data.summary}</b><p>{n.data.body}</p></blockquote>:<p key={n.id}>{n.data.body}</p>)}</article></section>}
export default function App(){
 const shellRef=useRef(null);const [scale,setScale]=useState(1)
 const [articles,setArticles]=useState(baseArticle);const [selected,setSelected]=useState('fact')
 const [widths,setWidths]=useState([17.5,42.5,22.5,17.5]);const [sourceCollapsed,setSourceCollapsed]=useState(false);const [savedSourceWidth,setSavedSourceWidth]=useState(17.5);const mins=[11,28,18,13]
 const current=articles.find(n=>n.id===selected)||articles[2]
 const change=(field,value)=>setArticles(a=>a.map(n=>n.id===current.id?{...n,data:{...n.data,[field]:value}}:n))
 const resize=(index,e)=>{e.preventDefault();const start=e.clientX,base=[...widths],root=e.currentTarget.parentElement,total=root.getBoundingClientRect().width
  document.body.classList.add('panel-resizing')
  const move=ev=>{const raw=(ev.clientX-start)/total*100;const low=mins[index]-base[index],high=base[index+1]-mins[index+1];const d=Math.max(low,Math.min(high,raw));const next=[...base];next[index]=base[index]+d;next[index+1]=base[index+1]-d;setWidths(next)}
  const up=()=>{document.body.classList.remove('panel-resizing');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)
 }
 const reset=()=>{setSourceCollapsed(false);setWidths([17.5,42.5,22.5,17.5])}
 const toggleSources=()=>{if(sourceCollapsed){const restore=Math.max(11,savedSourceWidth);setWidths(w=>[restore,w[1]-(restore-w[0]),w[2],w[3]]);setSourceCollapsed(false)}else{const collapsed=4;setSavedSourceWidth(widths[0]);setWidths(w=>[collapsed,w[1]+(w[0]-collapsed),w[2],w[3]]);setSourceCollapsed(true)}}
 useEffect(()=>{const update=()=>{const vw=window.innerWidth,vh=window.innerHeight;const next=Math.min(1,vw/1575,vh/900);setScale(Math.max(.5,next))};update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[])
 return <div className="viewportFit"><div className="fitStage" ref={shellRef} style={{zoom:scale,width:(100/scale)+"%",height:(100/scale)+"%"}}><div className="app"><header><div className="brand">NodeArticle <small>취재의 근거가 살아있는 글쓰기</small></div><div className="headerStory"><span>‹</span><b>서울시 자율주행 버스 시범운행 시작</b><small>◷ 저장됨 · 10:24</small></div><nav><button className="active">작성</button><button>자료</button><button>검증</button><button>히스토리</button><button className="export">내보내기⌄</button><i>J</i></nav></header>
 <main className="workspace">
  <div className={"pane sourcePane"+(sourceCollapsed?" isCollapsed":"")} style={{width:widths[0]+'%'}}><Sources collapsed={sourceCollapsed} onToggle={toggleSources}/></div><div className={"paneResizer"+(sourceCollapsed?" locked":"")} onPointerDown={e=>!sourceCollapsed&&resize(0,e)} onDoubleClick={reset} title="드래그해서 패널 너비 조절 · 더블클릭으로 초기화"/>
  <div className="pane" style={{width:widths[1]+'%'}}><Graph articles={articles} setArticles={setArticles} setSelected={setSelected} scale={scale}/></div><div className="paneResizer" onPointerDown={e=>resize(1,e)} onDoubleClick={reset} title="드래그해서 패널 너비 조절 · 더블클릭으로 초기화"/>
  <div className="pane" style={{width:widths[2]+'%'}}><LiveArticle articles={articles}/></div><div className="paneResizer" onPointerDown={e=>resize(2,e)} onDoubleClick={reset} title="드래그해서 패널 너비 조절 · 더블클릭으로 초기화"/>
  <div className="pane" style={{width:widths[3]+'%'}}><Properties node={current} onChange={change}/></div>
 </main></div></div></div>
}
