import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';

interface Props {
  mobile: boolean;
}

/**
 * Postprocesado: Bloom (encendido celular), Depth of Field (profundidad cálida)
 * y Vignette suave. En móvil se aligera; si reduced motion, no se monta.
 */
export function Effects({ mobile }: Props) {
  return (
    <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
      <Bloom
        intensity={mobile ? 0.5 : 0.85}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      {mobile ? (
        <></>
      ) : (
        <DepthOfField focusDistance={0.012} focalLength={0.04} bokehScale={3} height={480} />
      )}
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}
