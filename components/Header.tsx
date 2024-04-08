'use client';
import React from 'react';
import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { cn } from '@/actions/utils';

export const Header = () => {
  // const context = React.useContext(AuthContext);
  const session = useSession();

  const handleSignOut = (event: any) => {
    event.preventDefault();
    try {
      signOut();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='flex justify-center p-4'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href='/' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/stats' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Stats
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {session && session.data && session.data.user ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {session.data.user.email}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='flex flex-col p-2 shadow-md rounded-md'>
                  <li>
                    <a
                      href='/employee'
                      className={cn(navigationMenuTriggerStyle(), 'width-max')}
                    >
                      Employee
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      onClick={handleSignOut}
                      className={navigationMenuTriggerStyle()}
                    >
                      Sign Out
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className='border rounded-md w-auto'>
              <Link href='/login' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Log In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
