import NotAuthorized from "../dashboard/_components/not-authorized";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
      <div>
        <NotAuthorized />
      </div>
    </div>
  );
}
