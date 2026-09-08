import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { updateAdmin } from '@/lib/db/admin';
export async function PUT(request: NextRequest) {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const admin = await getAdminFromRequest(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    const updateData: {
      name: string;
      email: string;
      password?: string;
    } = {
      name,
      email,
    };

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }

      if (!admin.password) {
        return NextResponse.json(
          { error: 'Admin password is not available' },
          { status: 400 }
        );
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        admin.password
      );

      if (!validPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      if (currentPassword === newPassword) {
        return NextResponse.json(
          { error: 'New password must be different from current password' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedAdmin = await updateAdmin(admin.id, updateData);

    if (!updatedAdmin) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}