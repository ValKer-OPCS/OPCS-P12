import AdminProjectUploader from '@/components/AdminProjectUploader/AdminProjectUploader'
import AdminProjectDeleter from '@/components/AdminProjectDeleter/AdminProjectDeleter'
import AdminProjectUpdater from '@/components/AdminProjectUpdater/AdminProjectUpdater'


const DashboardProject = () => {
  return (
    <div>
      <AdminProjectUploader/>

      <AdminProjectDeleter />

      <AdminProjectUpdater />
    </div>
  )
};

export default DashboardProject
