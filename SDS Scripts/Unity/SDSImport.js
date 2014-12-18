// SDS-3D-Model-Format
// SDSImport.js
//
// Copyright (c) 2013, 2014. Jake Haas. All Right Reserved, http://jakehaas.com/
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
// KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.

import System.Text.RegularExpressions;
import System;
import System.IO;

@MenuItem ("Assets/Import SDS %i")
static function ImportSDS()
{
	// Open dialog for file input
	filepath = EditorUtility.OpenFilePanel("Import SDS", "","sds");
	
    if (File.Exists(filepath))
	{	
        // Open file
		var sdsReader : StreamReader = new StreamReader(filepath);
        var sdsLine : String;
		sdsLine = sdsReader.ReadLine();
    
		var objectName : String;
		var translation : Vector3;
		var rotation : Vector3;
		var scale : Vector3;
		var numVertices : int;
		var numTriangles : int;
		var numNormals : int;
		var numUVs : int;
		var vtx;
		var tri;
		var norm;
		var uv;
		
		// Scan each line
		while(sdsLine!=null)
		{
			// Get object name
			if (Regex.Match(sdsLine,"StartObject").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split("]"[0]);
				objectName = subTemp[0];
			}
			// Get translation
			else if (Regex.Match(sdsLine,"Translation").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split(","[0]);

				translation.x = float.Parse(subTemp[0]);
				translation.y = float.Parse(subTemp[1]);
				translation.z = float.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1));
			}
			// Get rotation
			else if (Regex.Match(sdsLine,"Rotation").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split(","[0]);

				rotation.x = float.Parse(subTemp[0]);
				rotation.y = float.Parse(subTemp[1]);
				rotation.z = float.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1));
			}
			// Get scale
			else if (Regex.Match(sdsLine,"Scale").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split(","[0]);

				scale.x = float.Parse(subTemp[0]);
				scale.y = float.Parse(subTemp[1]);
				scale.z = float.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1));
			}
			// Get number of vertices
			else if (Regex.Match(sdsLine,"numVertices").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split("]"[0]);

				numVertices = int.Parse(subTemp[0]);
			}
			// Get number of triangles
			else if (Regex.Match(sdsLine,"numTriangles").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split("]"[0]);

				numTriangles = int.Parse(subTemp[0]);
			}
			// Get number of normals
			else if (Regex.Match(sdsLine,"numNormals").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split("]"[0]);

				numNormals = int.Parse(subTemp[0]);
			}
			// Get number of UVs
			else if (Regex.Match(sdsLine,"numUVs").Success)
			{
				temp = sdsLine.Split("["[0]);
				subTemp = temp[1].Split("]"[0]);

				numUVs = int.Parse(subTemp[0]);
			}
			// Get vertices
			else if (Regex.Match(sdsLine,"Vertices").Success)
			{
				vtx = new Vector3[numVertices];
				i = 0;
				sdsLine = sdsReader.ReadLine();
				
				while (!Regex.Match(sdsLine,"}").Success)
				{
					temp = sdsLine.Split("["[0]);
					subTemp = temp[1].Split(","[0]);

					vtx[i++] = new Vector3(float.Parse(subTemp[0]), 
											float.Parse(subTemp[1]), 
											float.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1)));
											
					sdsLine = sdsReader.ReadLine();
				}
			}
			// Get triangles
			else if (Regex.Match(sdsLine,"Triangles").Success)
			{
				tri = new int[numTriangles * 3];
				i = 0;
				sdsLine = sdsReader.ReadLine();
				
				while (!Regex.Match(sdsLine,"}").Success)
				{
					temp = sdsLine.Split("["[0]);
					subTemp = temp[1].Split(","[0]);

					tri[i++] = int.Parse(subTemp[0]);
					tri[i++] = int.Parse(subTemp[1]);
					tri[i++] = int.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1));
					
					sdsLine = sdsReader.ReadLine();
					print (tri[i - 1] + "   " + i);
				}
			}
			// Get normals
			else if (Regex.Match(sdsLine,"Normals").Success)
			{
				norm = new Vector3[numNormals];
				i = 0;
				sdsLine = sdsReader.ReadLine();
				
				while (!Regex.Match(sdsLine,"}").Success)
				{
					temp = sdsLine.Split("["[0]);
					subTemp = temp[1].Split(","[0]);

					norm[i++] = new Vector3(float.Parse(subTemp[0]), float.Parse(subTemp[1]), float.Parse(subTemp[2].Substring(0, subTemp[2].Length - 1)));
					sdsLine = sdsReader.ReadLine();
				}
			}
			// Get UVs
			else if (Regex.Match(sdsLine,"UVs").Success)
			{
				uv = new Vector2[numUVs];
				i = 0;
				sdsLine = sdsReader.ReadLine();
				
				while (!Regex.Match(sdsLine,"}").Success)
				{
					temp = sdsLine.Split("["[0]);
					subTemp = temp[1].Split(","[0]);

					uv[i++] = new Vector2(float.Parse(subTemp[0]), float.Parse(subTemp[1].Substring(0, subTemp[1].Length - 1)));
					sdsLine = sdsReader.ReadLine();
				}
			}
			// Create object
			else if (Regex.Match(sdsLine,"EndObject").Success)
			{
				var newObj : GameObject = new GameObject(objectName);
				newObj.AddComponent(MeshFilter);
				newObj.AddComponent(MeshRenderer);
	
				var mesh = new Mesh ();
				newObj.GetComponent(MeshFilter).mesh = mesh;
	
				// Assign mesh data
				mesh.vertices = vtx;
				mesh.triangles = tri;
				mesh.normals = norm;
				mesh.uv = uv;
				
				// Apply transformation
				newObj.transform.position = translation;
				newObj.transform.eulerAngles = rotation;
				newObj.transform.localScale = scale;
				
				// Save to Prefab
				newObj.active = false;
				EditorUtility.ReplacePrefab (newObj, EditorUtility.CreateEmptyPrefab("Assets/" + objectName + ".prefab"));
				DestroyImmediate (newObj);
				AssetDatabase.Refresh();
				
				print(filepath + " imported successfully!");
			}			
			
            sdsLine = sdsReader.ReadLine();
        }
		
    }
	else
	{
        EditorUtility.DisplayDialog("Import Error", "SDS file not found!", "Cancel");
        return;
    }
}