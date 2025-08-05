// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@/@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@/@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@/@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@/@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@/@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@/@core/styles/vertical/menuSectionStyles'
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void })  => {
  // const VerticalMenu = dynamic(() => import('./VerticalMenu'), { ssr: false });

  const router = useRouter();
  const theme = useTheme();
  const { isBreakpointReached, transitionDuration } = useVerticalNav();
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar;

   const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading
  const [role, setRole] = useState('');
  const [name, setName] = useState('');

  const refreshToken = useCallback(async () => {
    try {
      await api.post('/refresh', {}, { withCredentials: true });
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(`/user`, { withCredentials: true });
        setIsAuthenticated(true);
        setRole(response.data.role || '');
        setName(`${response.data.firstName || ''} ${response.data.lastName || ''}`.trim());
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
          error.config.__isRetryRequest = true;
          const refreshed = await refreshToken();
          if (refreshed) {
            return api(error.config);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/');
    }
  }, [isAuthenticated, router]);


  // const role = Cookies.get('role');
  // console.log(role)
    // const token = Cookies.get('authToken');

    // if (!Cookies.get('authToken')) {
    //   router.push('/login');
    //   // return null;
    // }

  // Function to check if a role can see a specific menu
  // const canView = (allowedRoles: string[]) => role && allowedRoles.includes(role);
  const canView = (allowedRoles: string[]) => role && (allowedRoles.includes(role) || role === 'SUPER_ADMIN');

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true),
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-line" /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuSection label="Dashboard">
          {/* Menu items based on roles */}
          {canView(['CLINIC_RECEPTIONIST', 'DOCTOR', 'WORKSHOP_RECEPTIONIST', 'NURSE', 'SUPER_ADMIN', 'FRONT_DESK']) && (
  <SubMenu label="Patients" icon={<i className="ri-user-settings-line" />}>
    <MenuItem href="/dashboard/patients">All Patients</MenuItem>
    {( role === 'CLINIC_RECEPTIONIST' || role === 'DOCTOR' || role === 'WORKSHOP_RECEPTIONIST' || role === 'NURSE' || role ==='SUPER_ADMIN') && (
      <MenuItem href="/dashboard/encounters" icon={<i className="ri-shield-keyhole-line" />}>
        Encounters
      </MenuItem>
    )}
  </SubMenu>
)}

{canView(['CLINIC_RECEPTIONIST', 'WORKSHOP_RECEPTIONIST']) && (

      <MenuItem href="/dashboard/receptionist-encounters" icon={<i className="ri-capsule-line" />}>
        Prescriptions
      </MenuItem>

)}

          {canView(['FRONT_DESK', 'DOCTOR', 'SUPER_ADMIN']) && (
            <MenuItem href="/dashboard/appointments" icon={<i className="ri-calendar-line" />}>
              Appointments
            </MenuItem>
          )}

           {canView(['FRONT_DESK', 'DOCTOR', 'SUPER_ADMIN']) && (
            <MenuItem href="/dashboard/appointment-queue" icon={<i className="ri-calendar-check-line" />}>
              Appointment Queue
            </MenuItem>
          )}

          {canView(['ADMIN', 'SUPER_ADMIN']) && (
             <SubMenu label='Users' icon={<i className='ri-group-line' />}>
             <MenuItem href='/dashboard/users/new-user'>
               New User
             </MenuItem>
             <MenuItem href='/dashboard/users'>
               All Users
             </MenuItem>
           
           </SubMenu>
          )}


{canView(['CLINIC_RECEPTIONIST', 'FRONT_DESK', 'WORKSHOP_RECEPTIONIST', 'NURSE', 'SUPER_ADMIN']) && (
            <MenuItem href="/dashboard/billings" icon={<i className="ri-shopping-cart-line" />}>
              Billings
            </MenuItem>
          )}


{canView(['ADMIN', 'SUPER_ADMIN']) && (
            <MenuItem href='/dashboard/clinic_receptionists' icon={<i className='ri-hand-heart-line' />}>
            Clinic Receptionists
          </MenuItem>
)}

{canView(['ADMIN', 'SUPER_ADMIN']) && (
         <MenuItem href='/dashboard/workshop_receptionists' icon={<i className='ri-table-line' />}>
         Workshop Receptionists
       </MenuItem>
)}


{canView(['ADMIN', 'SUPER_ADMIN']) && (
        <MenuItem href='/dashboard/front_desks' icon={<i className='ri-mac-line' />}>
        Front Desk
      </MenuItem>
)}

{canView(['ADMIN', 'SUPER_ADMIN']) && (
        <MenuItem href='/dashboard/doctors' icon={<i className='ri-stethoscope-line' />}>
        Doctors
      </MenuItem>
)}

{canView(['ADMIN', 'SUPER_ADMIN']) && (
      <MenuItem href='/dashboard/nurses' icon={<i className='ri-nurse-fill' />}>
      Nurses
    </MenuItem>
)}


{/* {canView(['7']) && (
     <SubMenu label='Medicines' icon={<i className='ri-capsule-line' />}>
     <MenuItem href='/dashboard/medicines/new-medicine'>
       New Medicine
     </MenuItem>
     <MenuItem href='/dashboard/medicines'>
       All Medicines
     </MenuItem>
     <MenuItem href='/dashboard/manufacturers/new-manufacturer'>
       New Manufacturer
     </MenuItem>
     
   </SubMenu>
)} */}


{canView(['ADMIN', 'SUPER_ADMIN']) && (
   <SubMenu label='HMOs' icon={<i className='ri-hospital-line' />}>
     <MenuItem href='/dashboard/hmos/new-hmo'>
       New HMO
     </MenuItem>
     <MenuItem href='/dashboard/hmos'>
       All HMOs
     </MenuItem>
   
   </SubMenu>
)}


{canView(['SUPER_ADMIN']) && (
            <SubMenu label="Price List" icon={<i className="ri-price-tag-3-line" />}>
              <MenuItem href='/dashboard/products'>Products</MenuItem>
              <MenuItem href='/dashboard/services'>Services</MenuItem>
            </SubMenu>
          )}
         
          {canView(['SUPER_ADMIN']) && (
            <SubMenu label="Inventory" icon={<i className="ri-stock-line" />}>
              <MenuItem href='/dashboard/inventories/medicines'>Medicines</MenuItem>
              {/* <MenuItem href='/dashboard/inventories/services'>Services</MenuItem> */}
              <MenuItem href="/dashboard/inventories/lenses">Opticals</MenuItem>
              <MenuItem href="/dashboard/inventories/frames">Frames</MenuItem>
              <MenuItem href="/dashboard/inventories/accessories">Accessories</MenuItem>
            </SubMenu>
          )}

      
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
