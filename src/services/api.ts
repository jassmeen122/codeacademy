
import { getCollection } from "@/integrations/mongodb/client";
import { ObjectId } from "mongodb";

export const ApiService = {
  // Courses
  async getCourses() {
    try {
      const coursesCollection = await getCollection("courses");
      const courses = await coursesCollection.find().toArray();
      
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  async getCourse(id: string) {
    try {
      const coursesCollection = await getCollection("courses");
      
      let query = {};
      try {
        // Try to use the id as ObjectId
        query = { _id: new ObjectId(id) };
      } catch (e) {
        // If it's not a valid ObjectId, use it as is
        query = { id: id };
      }
      
      const course = await coursesCollection.findOne(query);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      return { success: true, data: course };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  async createCourse(courseData: any) {
    try {
      const coursesCollection = await getCollection("courses");
      const result = await coursesCollection.insertOne(courseData);
      
      // Fetch the inserted document
      const insertedDoc = await coursesCollection.findOne({ _id: result.insertedId });
      
      return { success: true, data: insertedDoc };
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  
  async getCourseResources(courseId: string) {
    try {
      const resourcesCollection = await getCollection("course_resources");
      const resources = await resourcesCollection.find({ course_id: courseId.toString() }).toArray();
      
      return { success: true, data: resources };
    } catch (error) {
      console.error(`Error fetching resources for course ${courseId}:`, error);
      throw error;
    }
  }
};
