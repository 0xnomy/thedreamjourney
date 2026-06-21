'use client';

import React from 'react';

export default function SufiHeritageArt() {
    return (
        <div className="relative w-full max-w-[380px] md:max-w-[420px] aspect-square flex items-center justify-center bg-transparent">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-amber-700/5 to-transparent rounded-full blur-3xl" />

            {/* SVG Illustration */}
            <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full relative z-10 select-none drop-shadow-[0_10px_20px_rgba(146,79,25,0.08)]"
            >
                <style>{`
                    /* Keyframe Animations */
                    @keyframes vibrate {
                        0%, 100% { transform: translate(0, 0) scaleY(1); }
                        25% { transform: translate(0.3px, -0.2px) scaleY(1.005); }
                        50% { transform: translate(-0.3px, 0.2px) scaleY(0.995); }
                        75% { transform: translate(-0.2px, -0.1px) scaleY(1.002); }
                    }

                    @keyframes pulseWave {
                        0%, 100% { 
                            opacity: 0.15; 
                            stroke-dashoffset: 0;
                            stroke-width: 0.8px;
                        }
                        50% { 
                            opacity: 0.65; 
                            stroke-dashoffset: -30;
                            stroke-width: 1.4px;
                            stroke: #d97706; /* Shift to lighter gold at peak */
                        }
                    }

                    @keyframes floatParticle {
                        0% {
                            transform: translateY(30px) translateX(0px);
                            opacity: 0;
                        }
                        10% {
                            opacity: 0.8;
                        }
                        90% {
                            opacity: 0.4;
                        }
                        100% {
                            transform: translateY(-90px) translateX(25px);
                            opacity: 0;
                        }
                    }

                    @keyframes slowSpin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes gentleHeave {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-8px) rotate(1.5deg); }
                    }

                    /* Class Bindings */
                    .anim-dervish {
                        transform-origin: 250px 250px;
                        animation: gentleHeave 7s ease-in-out infinite;
                    }

                    .anim-string-1 {
                        transform-origin: 260px 300px;
                        animation: vibrate 0.15s linear infinite;
                    }
                    .anim-string-2 {
                        transform-origin: 260px 300px;
                        animation: vibrate 0.18s linear infinite;
                    }
                    .anim-string-3 {
                        transform-origin: 260px 300px;
                        animation: vibrate 0.22s linear infinite;
                    }

                    .anim-wave-1 {
                        stroke-dasharray: 8 6;
                        animation: pulseWave 4s ease-in-out infinite;
                    }
                    .anim-wave-2 {
                        stroke-dasharray: 10 8;
                        animation: pulseWave 5s ease-in-out infinite;
                    }
                    .anim-wave-3 {
                        stroke-dasharray: 12 10;
                        animation: pulseWave 6s ease-in-out infinite;
                    }

                    .particle {
                        fill: #924f19;
                        opacity: 0;
                    }
                    .particle-gold {
                        fill: #d97706;
                        opacity: 0;
                    }

                    .p1 { animation: floatParticle 8s infinite ease-in-out; animation-delay: 0s; transform-origin: 320px 340px; }
                    .p2 { animation: floatParticle 10s infinite ease-in-out; animation-delay: 2s; transform-origin: 280px 310px; }
                    .p3 { animation: floatParticle 7s infinite ease-in-out; animation-delay: 4.5s; transform-origin: 340px 370px; }
                    .p4 { animation: floatParticle 9s infinite ease-in-out; animation-delay: 1s; transform-origin: 300px 330px; }
                    .p5 { animation: floatParticle 11s infinite ease-in-out; animation-delay: 3.5s; transform-origin: 350px 350px; }

                    .halo {
                        transform-origin: 250px 250px;
                        animation: slowSpin 35s linear infinite;
                        stroke-dasharray: 4 200;
                    }
                `}</style>

                {/* Ambient Musical Halo/Aura */}
                <circle cx="250" cy="250" r="235" stroke="#924f19" strokeOpacity="0.08" strokeWidth="0.8" />
                <circle cx="250" cy="250" r="235" stroke="#d97706" strokeOpacity="0.3" strokeWidth="1.5" className="halo" />
                <circle cx="250" cy="250" r="210" stroke="#924f19" strokeOpacity="0.05" strokeWidth="0.8" />

                {/* Animated Floating Sparks ("Noor" / Musical Resonance) */}
                <circle cx="320" cy="340" r="2.5" className="particle p1" />
                <circle cx="280" cy="310" r="1.8" className="particle-gold p2" />
                <circle cx="340" cy="370" r="3" className="particle p3" />
                <circle cx="300" cy="330" r="1.5" className="particle-gold p4" />
                <circle cx="350" cy="350" r="2" className="particle p5" />

                {/* Main Drawing Container with gentle movement */}
                <g className="anim-dervish">
                    {/* 1. SUFI DERVISH SILHOUETTE (ELEGANT MINIMALIST LINE ART) */}
                    
                    {/* Whirling Gown (Tennure) Flowing Curves */}
                    {/* Outermost flared skirt curve */}
                    <path
                        d="M 245,230 C 190,265 110,315 90,385 C 84,402 96,408 115,408 C 210,408 280,408 385,408 C 402,408 412,402 406,385 C 386,315 310,265 255,230"
                        stroke="#924f19"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeOpacity="0.9"
                    />

                    {/* Concentric spin/swirl motion lines inside the gown */}
                    <path
                        d="M 140,355 C 180,380 240,392 300,390"
                        stroke="#924f19"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeOpacity="0.4"
                    />
                    <path
                        d="M 175,315 C 210,345 260,358 315,348"
                        stroke="#924f19"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeOpacity="0.3"
                    />
                    <path
                        d="M 210,270 C 235,300 275,315 325,295"
                        stroke="#d97706"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeOpacity="0.5"
                    />

                    {/* Torso & Sikke (Dervish Hat) */}
                    {/* The Sikke (Hat) - Tall, conical shape representing the tombstone of the ego */}
                    <path
                        d="M 238,122 C 238,102 262,102 262,122 L 258,150 L 242,150 Z"
                        fill="#fdfbf7"
                        stroke="#924f19"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {/* Ecstatic Tilted Head/Neck */}
                    <path
                        d="M 246,155 C 246,155 242,166 250,172 C 258,178 266,168 266,168"
                        stroke="#924f19"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    {/* Inner vest coat details */}
                    <path
                        d="M 242,185 C 246,198 248,212 245,230 L 255,230 C 252,212 254,198 258,185"
                        stroke="#924f19"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeOpacity="0.6"
                    />

                    {/* Whirling Outstretched Arms (Classic ecstatic posture) */}
                    {/* Left Arm pointing to heaven (Receiving divine grace) */}
                    <path
                        d="M 244,182 C 212,176 182,136 162,106 C 159,102 165,99 167,102 C 182,126 208,156 242,176"
                        stroke="#924f19"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {/* Right Arm pointing to earth (Distributing grace to the world) */}
                    <path
                        d="M 256,182 C 280,192 315,212 335,237 C 338,241 333,243 331,240 C 314,217 284,197 258,189"
                        stroke="#924f19"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />


                    {/* 2. THE SITAR/TANPURA (INTEGRATED INTO THE DERVISH HEART) */}
                    
                    {/* Large Resonating Gourd (Tumba) - Melds beautifully into the bottom right skirt */}
                    <path
                        d="M 315,355 C 285,375 282,425 322,448 C 362,471 405,432 395,380 C 385,338 335,335 315,355 Z"
                        fill="#fcf8f0"
                        stroke="#924f19"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        strokeOpacity="0.95"
                    />
                    {/* Sitar Sound-hole floral geometric patterns (small dots & details) */}
                    <circle cx="345" cy="385" r="4" stroke="#924f19" strokeWidth="0.8" strokeOpacity="0.5" />
                    <circle cx="345" cy="385" r="1.5" fill="#924f19" strokeOpacity="0.5" />
                    <circle cx="335" cy="392" r="1" fill="#924f19" />
                    <circle cx="355" cy="378" r="1" fill="#924f19" />
                    <circle cx="338" cy="378" r="1" fill="#924f19" />
                    <circle cx="352" cy="392" r="1" fill="#924f19" />

                    {/* Sitar Diagonal Neck (Dandi) - Elegantly crossing the whirling dervish */}
                    <path
                        d="M 340,370 L 172,202"
                        stroke="#924f19"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 347,363 L 179,195"
                        stroke="#924f19"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeOpacity="0.7"
                    />
                    {/* Frets along the neck (horizontal lines) */}
                    <line x1="325" y1="355" x2="331" y2="349" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="310" y1="340" x2="316" y2="334" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="295" y1="325" x2="301" y2="319" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="280" y1="310" x2="286" y2="304" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="265" y1="295" x2="271" y2="289" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="250" y1="280" x2="256" y2="274" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="235" y1="265" x2="241" y2="259" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="220" y1="250" x2="226" y2="244" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="205" y1="235" x2="211" y2="229" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="190" y1="220" x2="196" y2="214" stroke="#924f19" strokeWidth="1" strokeOpacity="0.7" />

                    {/* Sitar Pegbox and Elegant Carved Scroll */}
                    <path
                        d="M 172,202 C 162,192 157,177 167,167 C 177,157 192,162 197,177 L 179,195"
                        stroke="#924f19"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    {/* Beautiful Tuning Pegs (small knobs) */}
                    <line x1="177" y1="192" x2="167" y2="197" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="182" y1="187" x2="192" y2="182" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="170" y1="181" x2="160" y2="186" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="175" y1="176" x2="185" y2="171" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Sitar Bridge (on the Gourd) */}
                    <line x1="353" y1="400" x2="367" y2="386" stroke="#924f19" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Vibrating Strings (gently animated with subtle scale & warp) */}
                    <line x1="360" y1="393" x2="176" y2="187" stroke="#d97706" strokeOpacity="0.85" strokeWidth="0.8" className="anim-string-1" />
                    <line x1="362" y1="391" x2="178" y2="185" stroke="#924f19" strokeOpacity="0.6" strokeWidth="0.5" className="anim-string-2" />
                    <line x1="358" y1="395" x2="174" y2="189" stroke="#924f19" strokeOpacity="0.5" strokeWidth="0.5" className="anim-string-3" />


                    {/* 3. RADIAL SOUND WAVES (ELEGANT CONCENTRIC EMBELLISHMENTS) */}
                    
                    {/* Concentric waves of musical vibration flowing outwards */}
                    <path
                        d="M 310,290 C 265,255 205,248 155,270"
                        stroke="#924f19"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeOpacity="0.2"
                        className="anim-wave-1"
                    />
                    <path
                        d="M 330,265 C 280,215 210,195 140,225"
                        stroke="#d97706"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeOpacity="0.3"
                        className="anim-wave-2"
                    />
                    <path
                        d="M 350,240 C 295,175 215,145 125,185"
                        stroke="#924f19"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeOpacity="0.15"
                        className="anim-wave-3"
                    />
                </g>
            </svg>
        </div>
    );
}
