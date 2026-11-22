import C from "../../constants/colors";
import NavItem from "../ui/NavItem";

const NAV_ITEMS = [
  { id: "dashboard", icon: "🏠",  label: "Dashboard"      },
  { id: "bot",       icon: "🤖",  label: "AI Agro Bot"    },
  { id: "disease",   icon: "🔬",  label: "Disease Detect" },
  { id: "map",       icon: "🗺️",  label: "Farm Map"       },
  { id: "market",    icon: "📈",  label: "Market Prices"  },
  { id: "marketplace", icon: "🌾", label: "Marketplace"   },
  { id: "community", icon: "👥",  label: "Community", badge: 3 },
  { id: "schemes",   icon: "🏛️",  label: "Gov Schemes"    },
  { id: "shops",     icon: "🏪",  label: "Agri Shops"     },
  { id: "profile",   icon: "👤",  label: "Profile"        },
];

export default function Sidebar({ user, page, setPage, t }) {
  return (
    /*
     * Sidebar: fixed width, full height, its own scroll.
     * NO sticky/absolute — just a flex child at 210px.
     * flex-shrink:0 ensures it never compresses.
     */
    <div
      className="sidebar-scroll"
      style={{
        width:         210,
        height:        "100%",        /* fill parent (App shell) */
        flexShrink:    0,             /* never compress */
        background:    C.dark,
        display:       "flex",
        flexDirection: "column",
        padding:       "0 8px",
      }}
    >
      {/* ── Logo ────────────────────────────────── */}
      <div style={{
        padding:      "16px 6px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 8,
        flexShrink:   0,             /* never compress logo */
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width:          36,
            height:         36,
            borderRadius:   9,
            background:     C.bg2,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       18,
            flexShrink:     0,
          }}>
            🌿
          </div>
          <div>
            <div style={{
              color:         "#fff",
              fontWeight:    700,
              fontSize:      14.5,
              letterSpacing: "-0.02em",
              lineHeight:    1.2,
            }}>
              Agro Zenith
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              Empowering Agriculture
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <div style={{
        flex:          1,            /* take remaining height */
        display:       "flex",
        flexDirection: "column",
        gap:           1,
        paddingBottom: 4,
      }}>
        {NAV_ITEMS.map(n => (
          <NavItem
            key={n.id}
            {...n}
            label={t ? t("nav." + n.id) : n.label}
            active={page === n.id}
            onClick={setPage}
          />
        ))}
      </div>

      {/* ── User footer ─────────────────────────── */}
      <div style={{
        padding:    "10px 6px 14px",
        borderTop:  "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,               /* never compress footer */
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width:          30,
            height:         30,
            borderRadius:   "50%",
            background:     C.bg2,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "#fff",
            fontSize:       11,
            fontWeight:     700,
            flexShrink:     0,
          }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <div style={{
              color:        "#fff",
              fontSize:     12,
              fontWeight:   500,
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.name.split(" ")[0]}
            </div>
            <div style={{
              color:        "rgba(255,255,255,0.38)",
              fontSize:     10,
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.district}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}