import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import shopBuilding from '@/assets/shop-building.png';

const videoSlides = [
  'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4',
  'https://cdn.pixabay.com/video/2021/04/06/70030-533716763_large.mp4',
  'https://cdn.pixabay.com/video/2019/10/28/28585-369736018_large.mp4',
];

const AutoPlayVideo = ({ src, index }: { src: string; index: number }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { ref.current?.play().catch(() => {}); }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-secondary/20 hover:ring-secondary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-12px_hsl(45,100%,50%,0.3)] group"
    >
      <div className="aspect-[9/16] relative">
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(348,85%,18%,0.5)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          className="absolute bottom-4 left-4 right-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.15 }}
        >
          <img src={logo} alt="RKE" className="h-10 mx-auto drop-shadow-[0_0_15px_rgba(255,204,0,0.5)]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const About = () => (
  <div>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.img
            src={logo}
            alt="Raj Kamal Exclusives"
            className="h-24 md:h-32 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(255,204,0,0.4)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Story</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Raj Kamal Exclusives has been a beacon of quality textiles and ethnic fashion for over three decades.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Story with Shop Image */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Weaving Dreams Since 1990</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Founded in the heart of Mumbai's textile district, Raj Kamal Exclusives started as a small family-owned shop with a passion for quality fabrics. Our founder believed that every piece of fabric tells a story — from the hands that wove it to the person who wears it.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Today, we source the finest silks from Varanasi, cottons from Gujarat, and designer fabrics from across India. Each product in our collection is handpicked to ensure the highest quality and authentic craftsmanship.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is simple: to bring you the best of Indian textiles with a modern touch. Whether you're looking for a wedding saree, a casual kurta, or trendy accessories — we have something special for everyone.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-secondary/20"
        >
          <img src={shopBuilding} alt="Raj Kamal Exclusives Shop" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>

    {/* Video Slides Section */}
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-[0.15em]">✦ Our World</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Experience <span className="text-gradient-gold">Raj Kamal</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">A glimpse into our collections, craftsmanship, and the vibrant world of Indian textiles.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {videoSlides.map((src, i) => (
            <AutoPlayVideo key={i} src={src} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">Our Values</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Authenticity', desc: 'Every product is sourced directly from artisans and weavers across India.' },
            { title: 'Quality', desc: 'We never compromise on the quality of our fabrics and designs.' },
            { title: 'Tradition', desc: 'We preserve traditional weaving techniques while embracing modern styles.' },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card p-6 rounded-xl shadow-warm text-center hover:shadow-gold transition-shadow duration-300"
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
