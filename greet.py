def greet(name: str) -> str:
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"


if __name__ == "__main__":
    import sys

    who = sys.argv[1] if len(sys.argv) > 1 else ""
    print(greet(who))
