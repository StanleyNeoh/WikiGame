package main

import (
    "net/http"
    "net/url"
    "io"
    "io/ioutil"
    "strings"
    "regexp"
    "errors"
    "bytes"
    "github.com/gin-gonic/gin"
    "golang.org/x/net/html"
)

type HTMLJSON struct {
    Style       string          `json:"style"`
    Content     string          `json:"content"`
}

func getSite(c *gin.Context) {
    c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
    c.Header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
    u, err := url.Parse(c.Query("site"))
    resp, err := http.Get(u.String())
    if (err != nil) {
        c.IndentedJSON(http.StatusBadRequest, err)
        return
    }
    defer resp.Body.Close()
    body, _:= ioutil.ReadAll(resp.Body)
    jsonObj := ProcessToJSON(string(body), u.Scheme + "://" + u.Host)
    c.IndentedJSON(http.StatusOK, jsonObj)
}

func ProcessToJSON(shtml string, origin string) HTMLJSON {
    doc, _ := html.Parse(strings.NewReader(shtml))
    content, _ := FindByID(doc, "content")
    head, _ := FindByElement(doc, "head")
    style, _ := ExtractRawStyles(head, origin)
    return HTMLJSON{ Style: style, Content: RenderNode(content) }
}

func RenderNode(n *html.Node) string {
    var buf bytes.Buffer
    w := io.Writer(&buf)
    html.Render(w, n)
    return buf.String()
}

func GetAttr(n *html.Node, key string) string {
    for _, attr := range n.Attr {
        if attr.Key == key {
            return attr.Val
        }
    }
    return ""
}

func PrefixOrigin(node *html.Node, origin string) {
    var crawler func(*html.Node)
    crawler = func(n *html.Node) {
        if n.Type == html.ElementNode {
            for i, attr := range n.Attr {
                if matched, _ := regexp.MatchString(`^\/[^\/].*`, attr.Val); matched {
                    n.Attr[i].Val = origin + n.Attr[i].Val
                }
            }
            for child := n.FirstChild; child != nil; child = child.NextSibling {
                crawler(child)
            }
        }
    }
    crawler(node)
}

func ExtractRawStyles(node *html.Node, origin string) (string, error) {
    PrefixOrigin(node, origin)
    s := ""
    for child := node.FirstChild; child != nil; child = child.NextSibling {
        if child.Data == "style" {
            s += child.FirstChild.Data + " "
        } else if GetAttr(child, "rel") == "stylesheet" {
            resp, err := http.Get(GetAttr(child, "href"))
            if err != nil {
                return "", err
            }
            body, _:= ioutil.ReadAll(resp.Body)
            resp.Body.Close()
            s += string(body) + " "
            
        }
    }
    rg := regexp.MustCompile(`url\(\/`)
    replace := "url(" + origin + "/"
    s = rg.ReplaceAllString(s, replace)
    return s, nil;
}

func FindByElement(doc *html.Node, elem string) (*html.Node, error) {
    var crawler func(*html.Node) *html.Node
    crawler = func(node *html.Node) *html.Node {
        if node.Type == html.ElementNode && node.Data == elem {
            return node
        }
        for child := node.FirstChild; child != nil; child = child.NextSibling {
            if n := crawler(child); n != nil  {
                return n
            }
        }
        return nil
    }
    if body := crawler(doc); body != nil {
        return body, nil
    }
    return nil, errors.New("Missing <" + elem + "> in the node tree")
}

func FindByID(doc *html.Node, id string) (*html.Node, error) {
    var crawler func(*html.Node) *html.Node
    crawler = func(node *html.Node) *html.Node {
        if node.Type == html.ElementNode && GetAttr(node, "id") == id {
            return node
        }
        for child := node.FirstChild; child != nil; child = child.NextSibling {
            if n:= crawler(child); n != nil {
                return n
            }
        }
        return nil
    }
    if head := crawler(doc); head != nil {
        return head, nil
    }
    return nil, errors.New("Missing #"+ id +" in the node tree")
}

func main() {
    router := gin.Default()
    router.GET("/", getSite);
    router.Run("localhost:8080")
}
