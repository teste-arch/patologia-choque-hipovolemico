import { memo, useEffect, useState } from "react";
import { Activity, ArrowRight, BookOpen, Check, Droplets, GraduationCap, Home, Info, ListChecks, PanelLeftClose, Presentation, Search, Stethoscope, Users, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import screens from "@/lib/sala/screens.html?raw";

type SalaRuntime = Window & {
  initializeSala?: () => void;
  uiManager?: { mostrarTela: (id: string) => void; iniciarCasoClinico: () => void; abrirModalConsultaRapida: () => void; abrirModalComoJogar: () => void; fecharModal: () => void };
  gameState?: { nomeJogador: string; prefs: { modoApresentacao?: boolean; somAtivo?: boolean }; savePreferences: () => void; listeners: unknown[] };
  vitalMonitor?: { toggleAudio: (enabled?: boolean) => boolean; animFrameId?: number; bipTimer?: number; audioCtx?: AudioContext; startEcgLoop: () => void };
  salaKeyHandler?: EventListener;
};
let runtimePromise: Promise<void> | undefined;
function loadRuntime() {
  if (!runtimePromise) runtimePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/sala/runtime.js";
    script.onload = () => resolve();
    script.onerror = () => { runtimePromise = undefined; reject(new Error("Não foi possível carregar as atividades.")); };
    document.body.appendChild(script);
  });
  return runtimePromise;
}
function runtime() { return window as SalaRuntime; }
const LegacyActivities = memo(function LegacyActivities() {
  return <div dangerouslySetInnerHTML={{ __html: screens }}/>;
});
export function SalaPlantao() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [screen, setScreen] = useState("telaHome");
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [audio, setAudio] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [progress, setProgress] = useState("0 de 7 etapas (0%)");
  useEffect(() => {
    let mounted = true;
    const onScreen = (event: Event) => setScreen((event as CustomEvent<string>).detail);
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ concluidas: number; percent: number }>).detail;
      setProgress(`${detail.concluidas} de 7 etapas (${detail.percent}%)`);
    };
    window.addEventListener("sala-screen", onScreen);
    window.addEventListener("sala-progress", onProgress);
    loadRuntime().then(() => {
      if (!mounted) return;
      runtime().initializeSala?.();
      setName(runtime().gameState?.nomeJogador ?? "");
      setReady(true);
      setPresentation(document.body.classList.contains("modo-apresentacao"));
      setAudio(runtime().gameState?.prefs.somAtivo ?? false);
    }).catch(() => { if (mounted) setError(true); });
    return () => {
      mounted = false;
      window.removeEventListener("sala-screen", onScreen);
      window.removeEventListener("sala-progress", onProgress);
      const app = runtime();
      if (app.salaKeyHandler) document.removeEventListener("keydown", app.salaKeyHandler);
      if (app.vitalMonitor?.animFrameId) cancelAnimationFrame(app.vitalMonitor.animFrameId);
      if (app.vitalMonitor?.bipTimer) clearInterval(app.vitalMonitor.bipTimer);
      app.vitalMonitor?.audioCtx?.close();
      if (app.gameState) app.gameState.listeners = [];
      document.body.classList.remove("modo-apresentacao");
      document.body.style.overflow = "";
    };
  }, []);
  function saveName() {
    const state = runtime().gameState;
    if (!state) return;
    state.nomeJogador = name.trim(); state.savePreferences(); setSaved(true);
  }
  function startCase() {
    saveName(); runtime().uiManager?.iniciarCasoClinico();
    const monitor = runtime().vitalMonitor;
    if (monitor && !monitor.animFrameId) monitor.startEcgLoop();
  }
  function show(id: string) { saveName(); runtime().uiManager?.mostrarTela(id); }
  function showTeam() {
    document.getElementById("secaoEquipeReferencias")?.scrollIntoView({ behavior: "smooth" });
  }
  function togglePresentation() {
    const enabled = document.body.classList.toggle("modo-apresentacao"); setPresentation(enabled);
    const state = runtime().gameState;
    if (state) { state.prefs.modoApresentacao = enabled; state.savePreferences(); }
  }
  const nav = [
    { label: "Visão geral", icon: Home, active: screen === "telaHome", action: () => show("telaHome") },
    { label: "Trilha teórica", icon: ListChecks, active: ["telaMapaTrilha", "telaParadaTeorica"].includes(screen), action: () => show("telaMapaTrilha") },
    { label: "Caso clínico", icon: Stethoscope, active: ["telaCasoClinico", "telaFinalCaso"].includes(screen), action: startCase },
    { label: "Consulta rápida", icon: Search, active: false, action: () => runtime().uiManager?.abrirModalConsultaRapida() },
    { label: "Equipe e referências", icon: Users, active: false, action: showTeam },
  ];
  return <div className={`plantao-shell${collapsed ? " is-collapsed" : ""}`}>
    <aside className="plantao-sidebar" aria-label="Menu principal">
      <div className="brand"><div className="brand-mark"><Droplets size={26} strokeWidth={2.5}/></div><div><div className="brand-name">SALA<br/>VERMELHA</div><div className="brand-caption">PATOLOGIA GERAL · FAC</div></div></div>
      <p className="sidebar-label">Central de estudo</p>
      <nav className="sidebar-nav">{nav.map(item => <Button key={item.label} variant="ghost" className="sidebar-button" data-active={item.active} aria-current={item.active ? "page" : undefined} title={item.label} disabled={!ready} onClick={item.action}><item.icon size={18}/><span>{item.label}</span></Button>)}</nav>
      <div className="sidebar-institution"><GraduationCap size={24}/><p>FAC — Faculdade<br/>Arquidiocesana de Curvelo</p><span>Enfermagem · 4º período<br/>Curvelo, MG</span></div>
    </aside>
    <main className="plantao-main">
      <header className="plantao-topbar">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expandir menu" : "Recolher menu"} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}><PanelLeftClose/></Button>
        <div className="progress-block"><div className="progress-heading"><span>PROGRESSO DO MÓDULO</span><span id="trilhaProgressText">{progress}</span></div><div className="progress-track"><div id="trilhaProgressFill" className="progress-fill"/></div></div>
        <div className="topbar-tools"><Button variant="outline" size="icon" disabled={!ready} title={audio ? "Silenciar monitor" : "Ativar som do monitor"} aria-label={audio ? "Silenciar monitor" : "Ativar som do monitor"} onClick={() => { const enabled = runtime().vitalMonitor?.toggleAudio() ?? false; setAudio(enabled); const state = runtime().gameState; if (state) { state.prefs.somAtivo = enabled; state.savePreferences(); } }}>{audio ? <Volume2/> : <VolumeX/>}</Button><Button variant={presentation ? "secondary" : "default"} disabled={!ready} onClick={togglePresentation} aria-pressed={presentation} title="Modo apresentação"><Presentation/><span>Modo aula</span></Button></div>
      </header>
      <section id="telaHome" className="screen active" aria-labelledby="heroTitle">
        <div className="home-intro">
          <span className="hero-header-badge"><Activity size={12}/>Seminário Tipos de Choque · 20/10/2026</span>
          <h1 id="heroTitle" className="home-title">Choque Hipovolêmico:<br/><span>Plantão na Sala Vermelha</span></h1>
          <div className="home-meta"><span><strong>Orientação:</strong> Profa. Paula Silveira</span><span><strong>Enfermagem:</strong> 4º período · FAC Curvelo</span></div>
          <div className="welcome-note"><div className="gota-avatar"><svg viewBox="0 0 64 64" role="img" aria-label="Gota, mascote da Sala Vermelha"><use href="#svgGotaMascoteBase"/></svg></div><div><h2>Plantão na Sala Vermelha 💧</h2><p>Explore a <strong>Trilha Teórica</strong> em 6 etapas rápidas ou assuma direto o leito do Lucas no <strong>Caso Clínico de Politrauma</strong>. Menos teoria maçante, mais ação!</p></div></div>
          <form className="name-area" onSubmit={event => { event.preventDefault(); saveName(); }}><label htmlFor="inputNomeEnfermeiro">Como devemos te chamar, enfermeiro(a)? <span>(opcional)</span></label><div className="name-input-row"><input id="inputNomeEnfermeiro" placeholder="Ex.: Paula, Frederico, Raphael..." maxLength={30} value={name} onChange={event => { setName(event.target.value); setSaved(false); }}/><Button disabled={!ready} size="sm" type="submit">{saved ? <Check/> : <ArrowRight/>}{saved ? "Pronto" : "Entrar"}</Button></div>{saved && name.trim() && <p className="name-greeting">Bom plantão, {name.trim()}!</p>}</form>
          <div className="home-actions">
            <Button className="action-button action-trail" disabled={!ready} onClick={() => show("telaMapaTrilha")}><BookOpen/><small>COMEÇAR AGORA</small><span>Trilha de Aprendizado</span></Button>
            <Button className="action-button action-clinical" disabled={!ready} onClick={startCase}><Stethoscope/><small>SIMULAÇÃO</small><span>Pular para Caso Clínico</span></Button>
            <Button variant="outline" className="action-button" disabled={!ready} onClick={() => runtime().uiManager?.abrirModalComoJogar()}><Info/><small>MANUAL</small><span>Como Funciona</span></Button>
            <Button variant="outline" className="action-button" disabled={!ready} onClick={() => runtime().uiManager?.abrirModalConsultaRapida()}><Search/><small>DÚVIDAS</small><span>Consulta Rápida</span></Button>
          </div>
          {error && <p role="alert">Não foi possível abrir as atividades. <Button variant="link" onClick={() => window.location.reload()}>Tentar novamente</Button></p>}
          <div className="home-bottom"><span><ListChecks size={13}/>6 paradas teóricas</span><span><Stethoscope size={13}/>1 caso clínico interativo</span><span><GraduationCap size={13}/>Patologia Geral</span></div>
        </div>
      </section>
      <LegacyActivities/>
      <footer className="site-footer">© 2026 Sala Vermelha · Enfermagem FAC Curvelo · Orientação: Profa. Paula Silveira</footer>
    </main>
  </div>;
}