export type ProjectImage = {
  src: string;
  alt: string;
  blurDataURL: string;
};

const blurPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PSc5JyB2aWV3Qm94PScwIDAgMTYgOSc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzknIGZpbGw9JyNlZWYyZjcnLz48L3N2Zz4=";

export const projectImages: Record<string, ProjectImage> = {
  "css-generator": {
    src: "/projects/css-generator.png",
    alt: "CSS Generator app preview",
    blurDataURL: blurPlaceholder,
  },
  "typespeed-tester": {
    src: "/projects/typespeed-tester.png",
    alt: "TypeSpeed Tester app preview",
    blurDataURL: blurPlaceholder,
  },
  "postman-api-tester": {
    src: "/projects/postman-api-tester.png",
    alt: "Postmen API testing dashboard preview",
    blurDataURL: blurPlaceholder,
  },
  "my-portfolio": {
    src: "/projects/my-portfolio.png",
    alt: "Personal portfolio website preview",
    blurDataURL: blurPlaceholder,
  },
};
