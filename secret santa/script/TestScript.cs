using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;



public class TestScript : MonoBehaviour
{
    public List<GameObject> panels;     
    private void Start()
    {
        DoTheMagic();
    }

    void Update()
    {
        if (Input.GetKey("escape"))
        {
            Application.Quit();
        }
    }

    public void DoTheMagic()
{
        string[] names = { "Pierre", "Jacques", "Laurent", "Quentin", "Rémi", "Thierry", "Julien", "Mathilde", "Joffray", "Etienne", "Jérémy", "Corentin", "Alexandra", "Valentin", "Johann" };
        System.Random rand = new System.Random();
    for (int i = names.Length - 1; i > 0; i--)
    {
        int j = rand.Next(0, i + 1);
        string temp = names[i];
        names[i] = names[j];
        names[j] = temp;
    }

    for (int i = 0; i < names.Length - 1; i++)
    {
            panels[i].GetComponent<PanelScript>().text.SetText(names[i] + " will give something to " + names[i + 1]);
    }
        panels[panels.Count - 1].GetComponent<PanelScript>().text.SetText(names[names.Length -1] + " will give something to " + names[0]);
    }

    public void QuitButton()
    {
        Application.Quit();
    }

}
