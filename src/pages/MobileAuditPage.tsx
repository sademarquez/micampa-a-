
import MobileAppAuditComplete from '@/components/MobileAppAuditComplete';
import PageLayout from '@/components/PageLayout';

const MobileAuditPage = () => {
  return (
    <PageLayout borderVariant="glow" borderColor="purple">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <MobileAppAuditComplete />
      </div>
    </PageLayout>
  );
};

export default MobileAuditPage;
