export default function MyTeamPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">내 팀 관리</h1>
      <p className="text-gray-600">코치/관리자만 접근할 수 있는 페이지입니다.</p>
      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
        <p className="font-semibold">현재 역할: ADMIN 또는 COACH</p>
        <p className="text-sm text-gray-600 mt-1">이 페이지는 관리자 또는 코치 계정으로 접근할 수 있습니다.</p>
      </div>
    </div>
  );
}
