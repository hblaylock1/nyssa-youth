"use client";

import SignatureCanvas from "react-signature-canvas";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof SignatureCanvas> & {
  onReady?: (instance: SignatureCanvas | null) => void;
};

export default function ClientSignaturePad({ onReady, ...rest }: Props) {
  return <SignatureCanvas ref={onReady} {...rest} />;
}
