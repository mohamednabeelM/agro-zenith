import { useState, useRef, useEffect } from "react";
import C from "../constants/colors";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

function AgroBot({ user }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState(user.language || "Tamil");
  const endRef = useRef(null);
  useEffect(() => { 
  const greeting = {
    Tamil: `வணக்கம் ${user.name.split(" ")[0]}! 🌿\n\nநான் உங்கள் Agro AI Bot. நான் உங்களுக்கு இவற்றில் உதவ முடியும்:\n\n🔬 பயிர் நோய் கண்டறிதல் (symptoms சொல்லுங்கள்)\n💊 உரம் & மருந்து அளவுகள் (specific dosages)\n🌦️ வானிலை அடிப்படையில் பரிந்துரை\n💰 சந்தை விலை & விற்கும் நேரம்\n🏛️ அரசு திட்டங்கள் (PM-KISAN, PMFBY, KCC)\n\nEnglish, Tamil, Hindi — எந்த மொழியிலும் கேளுங்கள்!`,
    English: `Hello ${user.name.split(" ")[0]}! 🌿\n\nI am Your Agro AI Bot. I can help you with these:\n\n🔬 Disease Diagnosis (describe symptoms)\n💊 Fertilizer & Pesticide Dosages (exact quantities)\n🌦️ Weather-Based Recommendations\n💰 Market Prices & Selling Time\n🏛️ Government Schemes (PM-KISAN, PMFBY, KCC)\n\nAsk in English, Tamil, Hindi - Listen in any language!`,
    Hindi: `नमस्ते ${user.name.split(" ")[0]}! 🌿\n\nमैं आपका Agro AI Bot हूँ। मैं आपकी इन चीज़ों में मदद कर सकता हूँ:\n\n🔬 रोग निदान (लक्षण बताएं)\n💊 उर्वरक और कीटनाशक की मात्राएँ (सटीक मात्रा)\n🌦️ मौसम आधारित सिफारिशें\n💰 बाजार मूल्य और बेचने का समय\n🏛️ सरकारी योजनाएं (PM-KISAN, PMFBY, KCC)\n\nअंग्रेजी, तमिल, या हिंदी में पूछें - किसी भी भाषा में सुनें!`,
  };

  setMsgs([{ 
    role: "assistant", 
    content: greeting[lang] || greeting.English 
  }]);
}, [lang, user.name]);

 const send = async (text) => {
    const q = (text || input).trim();
    if (!q || busy) return;

    setInput("");
    setBusy(true);

    const updated = [...msgs, { role: "user", content: q }];
    setMsgs(updated);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updated,
          language: lang,
          farmer_name: user.name || "",
          district: user.district || "",
          crops: user.crops || [],
          land_size: user.landSize || 0,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Chat API ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const reply = data.reply || data.completion || data.message || "Gemini AI did not return a reply.";
      setMsgs((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMsgs((prev) => [...prev, { role: "assistant", content: `⚠️ Chat error: ${err.message || err}` }]);
    } finally {
      setBusy(false);
    }
  };

  // 'quick' is not defined பிழையைச் சரிசெய்ய இந்த பகுதியைச் சேர்க்கவும்
  const quick = lang === "Tamil"
    ? ["தக்காளி இலையில் பழுப்பு புள்ளி", "அரிசி பயிருக்கு உரம்", "PM-KISAN விண்ணப்பம் எப்படி?", "நாளை நீர்பாய்ச்சலாமா?"]
    : lang === "Hindi"
      ? ["टमाटर के पत्ते पर भूरे धब्बे हैं", "चावल की फसल के लिए उर्वरक", "PM-KISAN आवेदन कैसे करें?", "क्या मुझे कल सिंचाई करनी चाहिए?"]
    : lang === "English"
      ? ["Tomato leaf brown spots", "Rice fertilizer dosage", "How to apply PM-KISAN?", "Should I irrigate tomorrow?"]
      : [];

    return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", padding:20, gap:12, boxSizing:"border-box" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:600, color:C.text, margin:0 }}>🤖 AI Agro Bot</h1>
          <p style={{ color:C.muted, fontSize:12.5, margin:"3px 0 0" }}>Powered by Gemini AI • Real agricultural expertise</p>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {["Tamil","English","Hindi"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding:"5px 12px", borderRadius:16, fontSize:12, cursor:"pointer", border:`1.5px solid ${lang===l?C.bg2:C.border}`, background:lang===l?C.pale:C.white, color:lang===l?C.bg2:C.muted, fontWeight:lang===l?600:400 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.white, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", minHeight:0 }}>
        <div style={{ background:`linear-gradient(135deg,${C.bg2},${C.dark})`, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🌿</div>
          <div>
            <div style={{ color:"#fff", fontWeight:600, fontSize:13.5 }}>Agro AI Bot</div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11 }}>● Online • Agricultural Expert</div>
          </div>
          <div style={{ marginLeft:"auto", color:"rgba(255,255,255,0.5)", fontSize:11 }}>Lang: {lang}</div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:14, background:"#e5ede5", display:"flex", flexDirection:"column", gap:7 }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              <div style={{ maxWidth:"76%", padding:"9px 13px", fontSize:13, lineHeight:1.55, whiteSpace:"pre-wrap", borderRadius:m.role==="user"?"14px 4px 14px 14px":"4px 14px 14px 14px", background:m.role==="user"?"#d4f5d4":C.white, color:C.text, boxShadow:"0 1px 2px rgba(0,0,0,0.07)" }}>{m.content}</div>
            </div>
          ))}
          {busy && <div style={{ display:"flex" }}><div style={{ padding:"9px 13px", borderRadius:"4px 14px 14px 14px", background:C.white, fontSize:12.5, color:C.muted, boxShadow:"0 1px 2px rgba(0,0,0,0.07)" }}>●●● typing</div></div>}
          <div ref={endRef} />
        </div>

        <div style={{ padding:"7px 10px", background:C.bg, borderTop:`1px solid ${C.border}`, display:"flex", gap:5, flexWrap:"wrap" }}>
          {quick.map(q => <button key={q} onClick={() => send(q)} style={{ fontSize:11.5, padding:"4px 10px", borderRadius:14, border:`1px solid ${C.border}`, background:C.white, color:C.bg2, cursor:"pointer" }}>{q}</button>)}
        </div>

        <div style={{ padding:10, background:C.white, display:"flex", gap:7, borderTop:`1px solid ${C.border}` }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={lang==="Tamil"?"உங்கள் கேள்வியை தமிழில் கேளுங்கள்...":"Ask your farming question..."}
            style={{ flex:1, padding:"9px 13px", borderRadius:22, border:`1px solid ${C.border}`, fontSize:13, outline:"none", background:C.bg, fontFamily:"inherit" }} />
          <button onClick={()=>send()} disabled={busy} style={{ padding:"9px 18px", background:busy?C.muted:C.bg2, color:"#fff", borderRadius:22, border:"none", cursor:busy?"default":"pointer", fontSize:13, fontWeight:500 }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default AgroBot;