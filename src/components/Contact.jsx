import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { openingHours, socials } from "../../constants";

const Contact = () => {
  useGSAP(() => {
    const titleSplit = SplitText.create("#contact h2", { type: "words" });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#contact",
        start: "top center%",
      },
      ease: "power1.inOut",
    });
    timeline
      .from(titleSplit.words, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.3,
      })
      .from("#contact h3, #contact p", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.2,
      })
      .to("#f-right-leaf", {
        y: "-50",
        duration: 1,
        ease: "power1.inOut",
      })
      .to(
        "#f-left-leaf",
        {
          y: "-50",
          duration: 1,
          ease: "power1.inOut",
        },
        "<",
      );
  });

  return (
    <footer id="contact">
      <img
        src="/images/footer-right-leaf.png"
        alt="right-leaf"
        id="f-right-leaf"
      />
      <img
        src="/images/footer-left-leaf.png"
        alt="left-leaf"
        id="f-left-leaf"
      />
      <div className="content">
        <h2>Where to Find Us</h2>
        <div>
          <h3>Visit out Bar</h3>
          <p> Kadıköy Boğası Karşısı , No:4/25 ,Kadıköy/İstanbul</p>
        </div>
        <div>
          <h3>Contact Us</h3>
          <p>+031 (534) 065 37 49</p>
          <p>hello@kafe.com</p>
        </div>
        <div>Open Every Day</div>
        {openingHours.map((time) => (
          <p key={time.day}>
            {time.day}: {time.time}
          </p>
        ))}
      </div>
      <div>
        <h3>Socials</h3>
        <div className="flex-center gap-5">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <img src={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
export default Contact;
