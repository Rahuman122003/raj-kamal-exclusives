import { motion } from 'framer-motion';

const About = () => (
  <div>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Story</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Raj Kamal Exclusives has been a beacon of quality textiles and ethnic fashion for over three decades.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
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
        </div>
        <div className="rounded-2xl overflow-hidden shadow-warm">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=500&fit=crop" alt="Our textile shop" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">Our Values</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Authenticity', desc: 'Every product is sourced directly from artisans and weavers across India.' },
            { title: 'Quality', desc: 'We never compromise on the quality of our fabrics and designs.' },
            { title: 'Tradition', desc: 'We preserve traditional weaving techniques while embracing modern styles.' },
          ].map(v => (
            <div key={v.title} className="bg-card p-6 rounded-xl shadow-warm text-center">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
