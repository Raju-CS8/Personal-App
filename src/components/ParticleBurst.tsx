import React, { createContext, useContext, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface ParticleContextType {
  triggerBurst: (x: number, y: number, count?: number) => void;
}

const ParticleContext = createContext<ParticleContextType>({
  triggerBurst: () => {},
});

export const useParticleBurst = () => useContext(ParticleContext);

export const ParticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerBurst = useCallback((x: number, y: number, count = 18) => {
    const colors = ['#38bdf8', '#4ee6aa', '#bdc2ff', '#ffffff', '#8ed5ff'];
    const newParticles: Particle[] = [];
    const baseId = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 80 + 40;
      newParticles.push({
        id: baseId + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 700);
  }, []);

  return (
    <ParticleContext.Provider value={{ triggerBurst }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="fixed rounded-full pointer-events-none animate-particle"
            style={
              {
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                left: `${p.x}px`,
                top: `${p.y}px`,
                boxShadow: `0 0 10px ${p.color}`,
                '--vx': `${p.vx}px`,
                '--vy': `${p.vy}px`,
                animation: 'particleFly 0.65s cubic-bezier(0.2, 0.9, 0.3, 1) forwards',
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </ParticleContext.Provider>
  );
};
