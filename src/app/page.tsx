import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Resume } from "@/components/sections/Resume";
import { Skills } from "@/components/sections/Skills";

// Work comes before biography: a recruiter should hit a live project within one scroll.
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <Resume />
      <Contact />
    </>
  );
}
