const Whatsapp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
    <g>
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.626.713.227 1.362.195 1.874.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="currentColor"
      />
      <path
        d="M12.004 2.003c-5.522 0-9.997 4.475-9.997 9.997 0 1.762.463 3.484 1.342 4.997L2 22l5.145-1.342c1.462.799 3.09 1.217 4.859 1.217 5.522 0 9.997-4.475 9.997-9.997 0-2.662-1.037-5.164-2.924-7.05C17.168 3.04 14.666 2.003 12.004 2.003zm0 17.994c-1.613 0-3.188-.43-4.547-1.244l-.324-.192-3.053.796.814-2.977-.21-.306C3.01 14.09 2.5 12.57 2.5 11.003c0-5.247 4.257-9.504 9.504-9.504 2.54 0 4.927.99 6.726 2.789 1.799 1.799 2.789 4.186 2.789 6.726 0 5.247-4.257 9.504-9.504 9.504z"
        fill="currentColor"
      />
    </g>
  </svg>
);

const Email = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
    <path
      d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4ZM20 8L12.5 13L5 8V6L12.5 11L20 6V8Z"
      fill="currentColor"
    />
  </svg>
);

const Thread = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.29289C16.3166 8.90237 15.6834 8.90237 15.2929 9.29289L11.2929 13.2929C10.9024 13.6834 10.9024 14.3166 11.2929 14.7071L13.2929 16.7071C13.6834 17.0976 14.3166 17.0976 14.7071 16.7071L18.7071 12.7071C19.0976 12.3166 19.0976 11.6834 18.7071 11.2929L16.7071 9.29289ZM7.29289 10C7.68342 10.3905 7.68342 11.0237 7.29289 11.4142L5.41421 13H10C10.5523 13 11 13.4477 11 14C11 14.5523 10.5523 15 10 15H5C4.44772 15 4 .552284 .447715 .000001L3 .000001H5V3H3V5H5V7H3V9H5V10H7V10Z"
      fill="currentColor"
    />
  </svg>
);

const SocialPost = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="7"
      y1="9"
      x2="17"
      y2="9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="7"
      y1="12"
      x2="17"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="7"
      y1="15"
      x2="13"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SaveIcon = ({ isSaved }: { isSaved: boolean }) => (
  <svg
    className={`w-5 h-5 ${isSaved ? "fill-foreground" : "fill-background"}`}
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
    />
  </svg>
);

export { Whatsapp, Thread, Email, SocialPost, SaveIcon };
