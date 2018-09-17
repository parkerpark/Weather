using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Weather.Web.Helpers
{
    public static partial class APIHelper
    {
        public static readonly String LocationUrl = APIUrl + "/location";





        public static async Task<T> Post<T>(String url, Object body) where T : class
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.Timeout = new TimeSpan(0, 3, 0);

            String content = String.Empty;

            if (body != null)
            {
                content = JsonConvert.SerializeObject(body);
            }

            HttpResponseMessage responseMessage = await client.PostAsync(url, new StringContent(content, Encoding.UTF8, "application/json"));
            //responseMessage.EnsureSuccessStatusCode();
            string responseBody = await responseMessage.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(responseBody);
        }

        public static async Task<T> Get<T>(String url, String parameter) where T : class
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.Timeout = new TimeSpan(0, 3, 0);

            HttpResponseMessage responseMessage = null;

            if (String.IsNullOrEmpty(parameter))
            {
                responseMessage = await client.GetAsync(url);
            }
            else
            {
                responseMessage = await client.GetAsync(url + '/' + parameter);
            }

            responseMessage.EnsureSuccessStatusCode();
            string responseBody = await responseMessage.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(responseBody);
        }
    }
}
