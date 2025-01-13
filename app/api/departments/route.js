import fs from 'fs';
import path from 'path';

const departmentsFilePath = path.join(process.cwd(), 'public', 'department.json');

// Helper to read departments
const readDepartments = () => {
  try {
    const fileContents = fs.readFileSync(departmentsFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.departments || [];
  } catch (err) {
    console.error("Error reading departments.json:", err);
    return [];
  }
};

// Helper to write departments
const writeDepartments = (departments) => {
  try {
    const data = { departments };
    fs.writeFileSync(departmentsFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to departments.json:", err);
    throw new Error("Failed to save departments.");
  }
};

// Handle GET request
export async function GET() {
  try {
    const departments = readDepartments();
    return new Response(JSON.stringify({ departments }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch departments." }), { status: 500 });
  }
}

// Handle POST request
export async function POST(request) {
  try {
    const { department } = await request.json();

    if (!department) {
      return new Response(JSON.stringify({ error: "Department name is required." }), { status: 400 });
    }

    const departments = readDepartments();

    if (departments.includes(department)) {
      return new Response(JSON.stringify({ error: "Department already exists." }), { status: 400 });
    }

    departments.push(department);
    writeDepartments(departments);

    return new Response(
      JSON.stringify({
        message: "Department added successfully.",
        departments,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST request:", err);
    return new Response(JSON.stringify({ error: "Failed to add department." }), { status: 500 });
  }
}

// Handle DELETE request
export async function DELETE(request) {
  try {
    const { department } = await request.json();

    if (!department) {
      return new Response(JSON.stringify({ error: "Department name is required." }), { status: 400 });
    }

    const departments = readDepartments();
    const updatedDepartments = departments.filter((dep) => dep !== department);

    if (departments.length === updatedDepartments.length) {
      return new Response(JSON.stringify({ error: "Department not found." }), { status: 400 });
    }

    writeDepartments(updatedDepartments);

    return new Response(
      JSON.stringify({
        message: "Department removed successfully.",
        departments: updatedDepartments,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE request:", err);
    return new Response(JSON.stringify({ error: "Failed to remove department." }), { status: 500 });
  }
}
