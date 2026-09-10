import Image from 'next/image';
import { managedUploadImageProps } from '@/lib/imageProps';

export default function MapleImage({ src, alt = '', ...props }) {
  return <Image src={src} alt={alt} {...managedUploadImageProps(src)} {...props} />;
}
