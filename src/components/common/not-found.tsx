import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex-1 flex-col flex justify-center items-center  ">
      <h2 className=" font-bold text-2xl text-base-600 mb-4">
        الصفحة غير موجودة
      </h2>
      <p className="mb-8">الصفحة التي تريد الوصول إليها غير موجودة</p>
      <Link
        to="/dashboard"
        className="bg-primary-700 px-6 py-1 text-white rounded hover:opacity-70 transition-opacity"
      >
        الرجوع للرئيسية
      </Link>
    </div>
  );
}
