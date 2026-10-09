import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Intro from './components/Intro.jsx';
import Program from './components/Program.jsx';
import Registration from './components/Registration.jsx';
import Footer from './components/Footer.jsx';
import { DEADLINE_ISO } from './config.js';
import { useCountdown } from './lib/useCountdown.js';

export default function App() {
  const countdown = useCountdown(DEADLINE_ISO);

  return (
    <>
      <a className="skip-link" href="#inscription">Aller au formulaire d’inscription</a>
      <Header />
      <main>
        <Hero countdown={countdown} />
        <Intro />
        <Program />
        <Registration countdown={countdown} />
      </main>
      <Footer />
    </>
  );
}
