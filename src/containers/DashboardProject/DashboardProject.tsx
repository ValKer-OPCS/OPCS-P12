import AdminProjectUploader from '@/components/AdminProjectUploader/AdminProjectUploader'
import AdminProjectDeleter from '@/components/AdminProjectDeleter/AdminProjectDeleter'


const DashboardProject = () => {
  return (
    <div>
      <AdminProjectUploader/>

      <AdminProjectDeleter />
    </div>
  )
};

export default DashboardProject
