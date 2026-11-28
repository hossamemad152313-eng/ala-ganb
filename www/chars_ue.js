/* شخصيات حقيقية (عمال بخامات) بحركات Mixamo معادة التوجيه على عضمهم.
   نفس واجهة nmChar القديمة: set(ph,amp,wave,sit,sk) / punch() / hand() / mats / g / d
   إضافات: die(t) و revive() و hit() للموت والضرب. الحركات من models3/characters/anims_ue.json */
(function (global) {
  'use strict';
  const T = global.THREE, PI = Math.PI;
  const CLIPS = ['Idle', 'Walk', 'Run', 'Punch', 'Kick', 'Hit Reaction', 'Death', 'Pointing', 'Wave', 'Sitting Idle'];

  /* يجهّز شخصية محمّلة: الحجم، الخامات، والـclips بأسماء عضمها */
  function setup(d, gltf, J) {
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(scene), size = box.getSize(new T.Vector3());
    d.k = d.h / (size.y || 1.8);
    d.yoff = -box.min.y * d.k;
    d.scene = scene;
    scene.traverse(n => {
      if (!n.isSkinnedMesh) return;
      const m = n.material;
      const lm = new T.MeshLambertMaterial({
        map: m.map || null, skinning: true,
        color: new T.Color(0.92, 0.92, 0.92), emissive: new T.Color(0.05, 0.05, 0.06),
        side: m.side, alphaTest: m.transparent ? 0.5 : (m.alphaTest || 0)
      });
      n.material = lm;
      n.frustumCulled = false;
    });
    const pel = scene.getObjectByName('pelvis');
    const hr = J._hr || [0, 0, 0];
    const rp = pel ? pel.position.clone() : new T.Vector3();
    d.clips = {};
    for (const name of CLIPS) {
      const c = J[name];
      if (!c) continue;
      const times = [];
      for (let i = 0; i < c.n; i++) times.push(Math.min(c.dur, i / c.fps));
      const tracks = [];
      for (const b in c.q) {
        if (!scene.getObjectByName(b)) continue;
        tracks.push(new T.QuaternionKeyframeTrack(b + '.quaternion', times, c.q[b]));
      }
      if (pel && c.hy) {
        const v = [];
        for (let i = 0; i < c.n; i++) v.push(rp.x + (c.hy[i * 3] - hr[0]), rp.y + (c.hy[i * 3 + 1] - hr[1]), rp.z + (c.hy[i * 3 + 2] - hr[2]));
        tracks.push(new T.VectorKeyframeTrack('pelvis.position', times, v));
      }
      d.clips[name] = new T.AnimationClip(name, c.dur, tracks);
    }
    return d;
  }

  function make(d) {
    const g = new T.Group(), o = T.SkeletonUtils.clone(d.scene), mats = [];
    o.scale.setScalar(d.k);
    o.position.y = d.yoff || 0;
    o.rotation.y = PI;
    g.add(o);
    o.traverse(n => {
      if (n.isSkinnedMesh) {
        n.castShadow = n.receiveShadow = false;
        n.material = n.material.clone();
        mats.push(n.material);
      }
    });
    const TN = [[.92,.92,.92],[.84,.9,1],[1,.9,.82],[.88,1,.9],[.95,.85,.95]][Math.floor(Math.random() * 5)];
    mats.forEach(m => m.color.setRGB(TN[0], TN[1], TN[2]));
    const mx = new T.AnimationMixer(o), A = {}, W = {};
    for (const k in d.clips) {
      const a = mx.clipAction(d.clips[k]);
      a.play(); a.setEffectiveWeight(0);
      A[k] = a; W[k] = 0;
    }
    const handB = o.getObjectByName('hand_r');
    const baseY = d.yoff || 0, sitLift = 0.36 * (d.h / 1.78);
    const cw = {
      g, mid: g, mats, d, ue: 1, sit: 0, ph: 0, amp: 0, pt: 0, pa: 0, ht: 0, dead: -1, hold: null, lt: 0,
      set(ph, a2, wave, sit) {
        const now = performance.now();
        const dt = this.lt ? Math.min(0.1, (now - this.lt) / 1000) : 0.016;
        this.lt = now;
        this.ph = ph; this.amp = a2; this.sit = sit ? 1 : 0;
        if (this.dead >= 0) return;
        let want = 'Idle', ts = null, fast = 8;
        if (this.pt) {
          const el = (now - this.pt) / 1000, nm = this.pa ? 'Kick' : 'Punch', du = d.clips[nm] ? d.clips[nm].duration : 1;
          if (el * 2.3 >= du) this.pt = 0; else { want = nm; ts = el * 2.3; fast = 30; }
        }
        if (!this.pt && this.ht) {
          const el = (now - this.ht) / 1000, du = d.clips['Hit Reaction'] ? d.clips['Hit Reaction'].duration : 1;
          if (el * 2.5 >= du) this.ht = 0; else { want = 'Hit Reaction'; ts = el * 2.5; fast = 30; }
        }
        if (want === 'Idle') {
          if (sit) want = 'Sitting Idle';
          else if (wave > 0.5) want = 'Pointing';
          else if (a2 >= 0.05) {
            want = a2 < 0.8 ? 'Walk' : 'Run';
            const du = d.clips[want] ? d.clips[want].duration : 1;
            ts = ((((ph * (want === 'Run' ? 0.68 : 1)) / (2 * PI)) % 1) + 1) % 1 * du;
          }
        }
        for (const k in A) {
          const tgt = k === want ? 1 : 0;
          W[k] += Math.max(-fast * dt, Math.min(fast * dt, tgt - W[k]));
          if (W[k] < 0.001 && tgt === 0) { if (A[k].getEffectiveWeight() !== 0) A[k].setEffectiveWeight(0); continue; }
          A[k].setEffectiveWeight(W[k]);
          if (k === want && ts !== null) A[k].time = ts;
          else if (W[k] > 0) A[k].time = (A[k].time + dt) % (d.clips[k].duration || 1);
        }
        o.position.y = baseY + (sit ? sitLift : 0);
        mx.update(0);
      },
      punch() { this.pt = performance.now(); this.pa ^= 1; },
      hit() { if (this.dead < 0) this.ht = performance.now(); },
      die(t) {
        const du = d.clips.Death ? d.clips.Death.duration : 3;
        this.dead = Math.max(0, t);
        for (const k in A) { const on = k === 'Death'; W[k] = on ? 1 : 0; A[k].setEffectiveWeight(W[k]); }
        if (A.Death) A.Death.time = Math.min(du - 0.02, this.dead * 2.2);
        o.position.y = baseY;
        mx.update(0);
      },
      revive() { this.dead = -1; this.pt = this.ht = 0; if (A.Death) A.Death.setEffectiveWeight(0); W.Death = 0; },
      hand() {
        const v = new T.Vector3();
        if (handB) { g.updateWorldMatrix(true, false); handB.getWorldPosition(v); }
        return v;
      }
    };
    cw.set(0, 0, 0, 0);
    return cw;
  }

  global.UE = { setup, make, CLIPS };
})(typeof window !== 'undefined' ? window : globalThis);
