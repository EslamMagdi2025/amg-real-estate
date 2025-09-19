// Admin Single Project API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single project for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    // Safe JSON parse function
    const safeJsonParse = (jsonString: string | null, defaultValue: any = []): any => {
      if (!jsonString) return defaultValue;
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn('Failed to parse JSON:', jsonString);
        // If it's not JSON and default is array, treat as comma-separated string
        if (Array.isArray(defaultValue)) {
          return jsonString.split(',').map((item: string) => item.trim()).filter(Boolean);
        }
        return defaultValue;
      }
    };

    // Transform data for admin editing
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      location: project.location,
      developer: project.developer,
      projectType: project.projectType,
      status: project.status,
      totalUnits: project.totalUnits,
      availableUnits: project.availableUnits,
      minPrice: project.minPrice,
      maxPrice: project.maxPrice,
      currency: project.currency,
      deliveryDate: project.deliveryDate,
      // amenities: project.amenities, // Field not in current schema
      features: safeJsonParse(project.features, []),
      contactName: project.contactName,
      contactPhone: project.contactPhone,
      contactEmail: project.contactEmail,
      mainImage: (project as any).mainImage,
      images: project.images?.map((img: any) => img.url) || [],
      featured: (project as any).featured || false,
      published: (project as any).published || false,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: transformedProject
    })

  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب المشروع' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const data = await request.json()

    const updateData = {
      title: data.title,
      description: data.description,
      location: data.location,
      developer: data.developer,
      projectType: data.projectType,
      status: data.status,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
    } as any; // Temporary type casting

    // Add optional fields if they exist in the schema
    if (data.totalUnits) updateData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits) updateData.availableUnits = parseInt(data.availableUnits);
    if (data.minPrice) updateData.minPrice = parseFloat(data.minPrice);
    if (data.maxPrice) updateData.maxPrice = parseFloat(data.maxPrice);
    if (data.currency) updateData.currency = data.currency;
    if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);
    if (data.area) updateData.area = parseInt(data.area);
    if (data.bedrooms) updateData.bedrooms = parseInt(data.bedrooms);
    
    // Handle features - convert array to JSON string
    if (data.features) {
      updateData.features = Array.isArray(data.features) 
        ? JSON.stringify(data.features)
        : typeof data.features === 'string' 
          ? data.features
          : JSON.stringify([])
    }

    // Handle other JSON fields
    if (data.specifications) updateData.specifications = JSON.stringify(data.specifications);
    if (data.paymentPlan) updateData.paymentPlan = JSON.stringify(data.paymentPlan);
    if (data.locationDetails) updateData.locationDetails = JSON.stringify(data.locationDetails);
    
    // Handle boolean fields for featured and published
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.published !== undefined) updateData.published = Boolean(data.published);

    // Update the project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        images: true
      }
    })

    // Update images if provided
    if (data.images && Array.isArray(data.images)) {
      // Delete existing images
      await prisma.projectImage.deleteMany({
        where: { projectId: projectId }
      })

      // Add new images
      if (data.images.length > 0) {
        await Promise.all(
          data.images.map((imageUrl: string, index: number) =>
            prisma.projectImage.create({
              data: {
                url: imageUrl,
                alt: `${data.title} - صورة ${index + 1}`,
                isMain: index === 0,
                order: index,
                projectId: projectId
              }
            })
          )
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      data: project
    })

  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في تحديث المشروع' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    // Delete project images first
    await prisma.projectImage.deleteMany({
      where: { projectId: projectId }
    })

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    })

  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في حذف المشروع' },
      { status: 500 }
    )
  }
}
