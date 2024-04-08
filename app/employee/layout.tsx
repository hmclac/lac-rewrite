import { Footer } from '@/app/employee/footer';

import '@/app/employee/styles.css';
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex flex-col'>
      <main className='flex-grow main-content'>{children}</main>
      <footer className='flex flex-col items-center py-4'>
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;
