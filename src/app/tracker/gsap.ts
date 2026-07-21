import { gsap } from "gsap";

export const initAnimation = () => {
  const timeline = gsap.timeline({ defaults: { duration: 0.8, opacity: 0 } });
  timeline
    .from("h1", {
      y: -20,
    })
    .from(".left", {
      x: -20,
    })
    .from(".right", {
      x: 20,
    })
    .from(".inc-exp-container", {
      y: 20,
    })
    .from("header .btn", {
      x: -20,
    });
};
