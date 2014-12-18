// SDS-3D-Model-Format
// SDSExport.js
//
// Copyright (c) 2013, 2014. Jake Haas. All Right Reserved, http://jakehaas.com/
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
// KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.

import System.IO;
import System.Text;
import System.Diagnostics; 

@MenuItem ("Assets/Export SDS %#e")
static function ExportToString()
{
	// Check selection
	if (Selection.activeGameObject == null)
	{
		EditorUtility.DisplayDialog("Export Error", "Please select an object to export.", "OK");
		return;
	}
	
	if (Selection.activeGameObject.GetComponent("MeshFilter") == null)
	{
		EditorUtility.DisplayDialog("Export Error", "You can only export objects with geometry.", "OK");
		return;
	}
	
	// Open dialog to file output
	savePath = EditorUtility.SaveFilePanel("SDS Export", "/usr/local/Desktop/", Selection.activeGameObject.name + ".sds", "sds");
	
	// Open output stream
	var sw : StreamWriter = new StreamWriter(savePath);
	
		// Write header
	var sdsString : String;
	sw.Write("// SDS format by Jake Haas\n// Exported with Unity " + Application.unityVersion + "\n\n");

	// Iterate through selection
	for (gameObject in Selection.gameObjects)
	{
		// Setup mesh info
		var mesh = gameObject.GetComponent("MeshFilter").sharedMesh;
		var trans:Transform = gameObject.transform;

		// Write object name
		sw.Write("StartObject [" + mesh.name + "] {\n\n");

		// Write transformation
		sw.Write("Translation [" + trans.position.x + "," + trans.position.y + "," + trans.position.z + "]\n");
		sw.Write("Rotation [" + trans.eulerAngles.x + "," + trans.eulerAngles.y + "," + trans.eulerAngles.z + "]\n");
		sw.Write("Scale [" + trans.localScale.x + "," + trans.localScale.y + "," + trans.localScale.z + "]\n\n");
			
		// Write number of vertices, triangles, normals and uv
		sw.Write("numVertices [" + mesh.vertexCount + "]\n");
		sw.Write("numTriangles [" + mesh.triangles.Length / 3 + "]\n");
		sw.Write("numNormals [" + mesh.normals.Length + "]\n");
		sw.Write("numUVs [" + mesh.uv.Length + "]\n\n");

		// Vertex positions
		sw.Write("Vertices {\n");
			
		// Write vertex coordinates
		for (i = 0; i < mesh.vertices.Length; i++)
		{
			sw.Write(i + " [" + mesh.vertices[i].x + "," + mesh.vertices[i].y + "," + mesh.vertices[i].z + "]\n");
		}
		
		sw.Write("}\n\n");
			
			
		// Triangulation description
		sw.Write("Triangles {\n");
			
		// Write triangle index pointers
		for (i = 0; i < mesh.triangles.Length; i += 3)
		{
			sw.Write(i / 3 + " [");
			sw.Write(mesh.triangles[i] + "," + mesh.triangles[i + 1] + "," + mesh.triangles[i + 2] + "]\n");
		}
		
		sw.Write("}\n\n");


		// Normal vectors
		sw.Write("Normals {\n");
			
		// Write normal vector coordinates
		for (i = 0; i < mesh.normals.Length; i++)
		{
			sw.Write(i + " [");
			sw.Write(mesh.normals[i].x + "," + mesh.normals[i].y + "," + mesh.normals[i].z + "]\n");
		}
		
		sw.Write("}\n\n");


		// UVs
		sw.Write("UVs {\n");
			
		// Write UV values
		for (i = 0; i < mesh.uv.Length; i++)
		{
			sw.Write(i + " [");
			sw.Write(mesh.uv[i].x + "," + mesh.uv[i].y + "]\n");
		}
		
		sw.Write("}\n\n");

		// Close object block
		sw.Write("} [EndObject]\n\n");
	}
        
	// Finalize and close
	sw.Close();

	print(mesh.name + " exported successfully!");
}
