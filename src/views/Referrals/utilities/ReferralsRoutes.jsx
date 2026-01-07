import { Route, Routes } from 'react-router-dom'
import Referrals from '../Referrals'
import InsertReferral from './InsertReferral'

const ReferralsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Referrals />} />
      <Route path="Insert/:id" element={<InsertReferral />} />
    </Routes>
  )
}

export default ReferralsRoutes