import { useState } from "react";
import C from "../constants/colors";
import S from "../utils/storage";
import { COMMUNITY_POSTS } from "../constants/data";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";

function Community({ user }) {
  const [posts, setPosts] = useState(() => S.get("community_posts") || COMMUNITY_POSTS);
  const [text, setText] = useState("");
  const [tag, setTag] = useState("Tip");
  const [crop, setCropTag] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    const p = { id:Date.now(), user:user.name.replace(" ","_"), av:user.name.slice(0,2).toUpperCase(), time:"Just now", post:text.trim(), replies:0, likes:0, tag, crop };
    const updated = [p, ...posts];
    setPosts(updated); S.set("community_posts", updated); setText("");
  };

  const like = (id) => {
    const updated = posts.map(p => p.id===id?{...p,likes:p.likes+1}:p);
    setPosts(updated); S.set("community_posts", updated);
  };

  const tagColor = { Disease:C.red, Treatment:C.bg2, Event:C.blue, Market:C.amber, Tip:C.purple };

  return (
    <div style={{ padding:22 }}>
      <h1 style={{ fontSize:21, fontWeight:600, color:C.text, margin:"0 0 4px" }}>👥 Farmer Community</h1>
      <p style={{ color:C.muted, fontSize:13, margin:"0 0 14px" }}>Share knowledge, ask questions, help each other grow • 2,841 farmers online</p>

      <Card style={{ marginBottom:14 }}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Share a farming tip, pest outbreak alert, market observation, or ask a question…"
          style={{ width:"100%", height:72, resize:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:10, fontSize:13, fontFamily:"inherit", outline:"none", background:C.bg, boxSizing:"border-box" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["Disease","Treatment","Market","Tip","Event","Weather"].map(t => (
              <button key={t} onClick={() => setTag(t)} style={{ padding:"4px 9px", borderRadius:12, fontSize:11.5, cursor:"pointer", border:`1.5px solid ${tag===t?tagColor[t]||C.bg2:C.border}`, background:tag===t?"#fff":C.bg, color:tag===t?tagColor[t]||C.bg2:C.muted, fontWeight:tag===t?600:400 }}>{t}</button>
            ))}
          </div>
          <Btn onClick={submit} style={{ padding:"8px 20px" }}>Post</Btn>
        </div>
      </Card>

      {posts.map((p,i) => (
        <Card key={p.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", gap:9, marginBottom:7 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:C.pale,color:C.bg2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0 }}>{p.av}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.user}</span>
                <Badge color={tagColor[p.tag]||C.muted} bg={C.bg}>{p.tag}</Badge>
                {p.crop && <Badge color={C.bg2} bg={C.pale}>{p.crop}</Badge>}
              </div>
              <div style={{ fontSize:11, color:C.muted }}>{p.time}</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:C.text, lineHeight:1.55, marginBottom:9 }}>{p.post}</div>
          <div style={{ display:"flex", gap:14, paddingTop:7, borderTop:`1px solid ${C.border}` }}>
            <button onClick={() => like(p.id)} style={{ fontSize:12.5, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>👍 Helpful ({p.likes})</button>
            <button style={{ fontSize:12.5, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>💬 Reply ({p.replies})</button>
            <button style={{ fontSize:12.5, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>🔗 Share</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Community;