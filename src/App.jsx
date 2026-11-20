import LandingPage from "./pages/LandingPage";
import InvitationPreview from "./pages/InvitationPreview";

function App() {
  const isInvitation =
    window.location.search.includes("token") ||
    window.location.pathname.includes("invitation");

  if (isInvitation) {
    return <InvitationPreview />;
  }

  return <LandingPage />;
}

export default App;
